import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import Navbar from '../components/Navbar';
import { Users, UserPlus, MapPin, Globe } from 'lucide-react';

// Disable static generation for this dynamic page
export function getServerSideProps() {
  return { props: {} };
}

export default function ProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        // Create sample profiles first
        await fetch('/api/sample-profiles', { method: 'POST' });
        
        // Then fetch all users
        const response = await fetch('/api/users');
        const data = await response.json();
        
        if (data.success) {
          setProfiles(data.data);
        } else {
          setError(data.message || 'Failed to fetch profiles');
        }
      } catch (err) {
        setError('An error occurred while fetching profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <>
        <Head>
          <title>Profiles - Loading...</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profiles...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Profiles - Error</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profiles</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.push('/')}>Go Home</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Profiles - Discover Designers</title>
        <meta name="description" content="Discover talented designers and developers" />
      </Head>
      
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Amazing Creators
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore profiles of talented designers, developers, and creators from around the world.
            </p>
          </div>

          {/* Profiles Grid */}
          {profiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {profiles.map((profile) => (
                <Card 
                  key={profile._id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  onClick={() => router.push(`/profile/${profile._id}`)}
                >
                  <CardContent className="p-6">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                        <AvatarFallback className="text-lg font-bold bg-gray-200">
                          {profile.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{profile.name}</h3>
                        <p className="text-gray-600">{profile.role}</p>
                      </div>
                    </div>

                    {/* About */}
                    {profile.about && (
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                        {profile.about}
                      </p>
                    )}

                    {/* Location and Website */}
                    <div className="space-y-2 mb-4">
                      {profile.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {profile.location}
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="h-4 w-4" />
                          {profile.website}
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>{profile.followers?.length || 0} followers</span>
                        <span>{profile.following?.length || 0} following</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/profile/${profile._id}`);
                        }}
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No profiles found</h3>
              <p className="text-gray-600 mb-6">
                Be the first to create a profile and start connecting with others!
              </p>
              <Button onClick={() => router.push('/signup')}>
                Create Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
