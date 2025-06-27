'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Profile = {
  id: string
  full_name: string
  bio: string
  avatar_url: string | null
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  /**
   * Fetches the user profile from Supabase.
   */
  const fetchProfile = async () => {
    setLoading(true)
    console.log('Fetching profile...')
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      console.log('No user logged in.')
      return
    }

    console.log('Logged in user ID:', user.id)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error.message)
    } else {
      console.log('Profile fetched:', data)
      setProfile(data) // Store the URL as is from the database
    }
    setLoading(false)
  }

  /**
   * Handles updating the profile details (full_name and bio) in Supabase.
   */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setLoading(true)
    console.log('Attempting to update profile (full_name, bio)...')
    console.log('Current profile state for update:', profile);

    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      bio: profile.bio,
    }).eq('id', profile.id)

    setLoading(false)
    if (error) {
      alert('Failed to update profile: ' + error.message)
      console.error('Update (full_name, bio) error:', error.message)
    } else {
      alert('Profile (full name & bio) updated successfully!')
      console.log('Profile (full name & bio) updated successfully.')
    }
  }

  /**
   * Handles file selection and uploads the new avatar to Supabase Storage.
   * It also updates the profile's avatar_url in the database with a unique filename.
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    setUploading(true)
    console.log('Starting avatar upload...')

    const fileExt = file.name.split('.').pop()
    // Generate a truly unique filename by combining user ID and a timestamp
    const uniqueFileName = `${profile.id}_${new Date().getTime()}.${fileExt}`
    console.log('Generated uniqueFileName for upload:', uniqueFileName);

    const currentAvatarUrl = profile.avatar_url;

    // --- STEP 1: Delete the old file from Supabase Storage if it exists ---
    if (currentAvatarUrl) {
      // Extract the filename from the old avatar_url
      // Note: If old URLs had timestamps, this will correctly parse them.
      const urlObject = new URL(currentAvatarUrl);
      const oldFileName = urlObject.pathname.split('/').pop();

      console.log('Existing avatar URL:', currentAvatarUrl);
      console.log('Attempting to extract old file name:', oldFileName);

      if (oldFileName) {
        console.log(`Deleting old avatar: ${oldFileName}`);
        const { error: deleteOldError } = await supabase.storage
          .from('avatars')
          .remove([oldFileName])

        if (deleteOldError) {
          console.warn('Could not delete old avatar:', deleteOldError.message)
          // Don't block the new upload, just log a warning.
          // This might happen if the old file was already deleted or never existed.
        } else {
          console.log(`Old avatar ${oldFileName} successfully deleted from storage.`);
        }
      }
    } else {
      console.log('No existing avatar to delete.');
    }

    // --- STEP 2: Upload the new file with its unique name ---
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(uniqueFileName, file, { upsert: false }) // upsert: false because we want a new file always

    if (uploadError) {
      console.error('Upload error:', uploadError.message)
      alert('Failed to upload avatar: ' + uploadError.message)
      setUploading(false)
      return
    }
    console.log('New file successfully uploaded to storage.')

    // --- STEP 3: Get the public URL of the newly uploaded file ---
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(uniqueFileName)
    const newAvatarUrl = publicUrlData.publicUrl
    console.log('New public avatar URL:', newAvatarUrl);


    // --- STEP 4: Update the profile's avatar_url in the database ---
    const { error: updateDbError } = await supabase
      .from('profiles')
      .update({ avatar_url: newAvatarUrl })
      .eq('id', profile.id)

    if (updateDbError) {
      console.error('Database update error after avatar upload:', updateDbError.message)
      alert('Failed to update profile with new avatar URL: ' + updateDbError.message)
    } else {
      setProfile({ ...profile, avatar_url: newAvatarUrl }) // Update local state
      alert('Avatar uploaded and profile updated successfully!')
      console.log('Profile avatar_url updated in database and local state.')
    }
    setUploading(false)
  }

  /**
   * Handles deleting the current avatar from Supabase Storage and the database.
   */
  const handleDeleteAvatar = async () => {
    if (!profile || !profile.avatar_url) return

    setDeleting(true)
    console.log('Starting avatar deletion...');

    // Extract the filename from the avatar_url (which will now be a unique filename)
    const urlObject = new URL(profile.avatar_url);
    const fileName = urlObject.pathname.split('/').pop();

    console.log('Avatar URL:', profile.avatar_url);
    console.log('Extracted file name for deletion:', fileName);

    if (!fileName) {
      alert('Could not determine avatar file name for deletion.')
      setDeleting(false)
      return
    }

    // Delete the file from Supabase Storage
    const { error: deleteStorageError } = await supabase.storage
      .from('avatars')
      .remove([fileName])

    if (deleteStorageError) {
      console.error('Delete storage error:', deleteStorageError.message)
      alert('Failed to delete avatar from storage: ' + deleteStorageError.message)
      setDeleting(false)
      return
    }
    console.log('File successfully deleted from storage.')

    // Update the profile's avatar_url in the database to null
    const { error: updateDbError } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', profile.id)

    if (updateDbError) {
      console.error('Database update error after deletion:', updateDbError.message)
      alert('Failed to update profile after avatar deletion: ' + updateDbError.message)
    } else {
      setProfile({ ...profile, avatar_url: null })
      alert('Avatar deleted successfully!')
      console.log('Profile avatar_url set to null in database and local state.')
    }
    setDeleting(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading && !profile) return <p>Loading profile...</p>
  if (!profile) return <p>No profile found. Please ensure you are logged in.</p>

  return (
    <form onSubmit={handleUpdate} className="space-y-4 max-w-xl">
      <div>
        <label htmlFor="fullName" className="block mb-1 font-medium">Full Name</label>
        <input
          id="fullName"
          type="text"
          className="w-full border rounded p-2"
          value={profile.full_name}
          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="bio" className="block mb-1 font-medium">Bio</label>
        <textarea
          id="bio"
          className="w-full border rounded p-2"
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
      </div>

      {/* Avatar Management Section */}
      <div>
        <label className="block mb-1 font-medium">Avatar</label>
        {profile.avatar_url ? (
          <div className="flex items-center gap-4 mb-2">
            <img
              src={profile.avatar_url} // This URL will now always be unique after an upload
              alt="Avatar"
              className="w-24 h-24 object-cover rounded-full border border-gray-300"
            />
            <button
              type="button"
              onClick={handleDeleteAvatar}
              disabled={deleting}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Avatar'}
            </button>
          </div>
        ) : (
          <p className="text-gray-600 mb-2">No avatar set.</p>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
        {uploading && <p className="text-sm text-gray-500 mt-1">Uploading new avatar...</p>}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading || uploading || deleting}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}