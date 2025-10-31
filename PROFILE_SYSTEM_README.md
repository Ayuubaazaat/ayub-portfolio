# Dribbble-Style User Profile System

A complete user profile system with Dribbble-inspired design, featuring dynamic user data fetching, follow/unfollow functionality, and responsive design.

## Features Implemented

### ✅ Core Profile Functionality
- **Dynamic Profile Pages**: `/profile/[userId]` - Fetches user data and posts from MongoDB
- **My Profile Redirect**: `/profile/me` - Redirects logged-in users to their actual profile
- **Profile Discovery**: `/profiles` - Browse all user profiles in a grid layout

### ✅ Database Schema Updates
- **Enhanced User Model**: Added fields for complete profile functionality:
  - `coverImage` - Profile banner/cover image
  - `followers` - Array of user IDs following this user
  - `following` - Array of user IDs this user follows
  - `about` - Bio/description (max 500 chars)
  - `location` - User's location (max 100 chars)
  - `website` - Personal website URL (max 200 chars)
  - `role` - Professional role/title (default: "Designer")
  - `verified` - Verification badge status

### ✅ API Endpoints
- **`/api/profile/[userId]`** - Fetch user profile data and posts
- **`/api/profile/follow`** - Handle follow/unfollow actions
- **`/api/users`** - Get all users for profile discovery
- **`/api/create-sample-profiles`** - Create sample data for testing

### ✅ UI Components & Design
- **Dribbble-Style Layout**:
  - Cover/banner image at the top
  - Avatar circle overlapping the banner
  - User name, role, and verification badge
  - Stats row: Followers | Following | Posts
  - Action buttons: Follow/Unfollow, Message, Save

- **About Section**:
  - Bio with clean typography
  - Location with map pin icon
  - Website with external link icon
  - Join date display

- **Posts Section**:
  - Grid layout displaying user's posts
  - Post cards with hover effects
  - Like and comment counts (mock data)
  - Click to view full post

### ✅ Authentication Integration
- **NextAuth Integration**: Seamless session handling
- **Protected Actions**: Follow/unfollow requires authentication
- **Own Profile Detection**: Different UI for own vs. other profiles
- **Login Redirect**: Unauthenticated users redirected to login

### ✅ Responsive Design
- **Mobile-First**: Stacked layout on mobile devices
- **Desktop**: Centered card layout with proper spacing
- **TailwindCSS**: Consistent styling with hover effects and transitions
- **Custom CSS**: Line-clamp utilities for text truncation

## File Structure

```
pages/
├── profile/
│   ├── [userId].js          # Dynamic profile page
│   └── me.js                # Redirect to user's profile
├── profiles.js              # Profile discovery page
└── api/
    ├── profile/
    │   ├── [userId].js      # Fetch profile data
    │   └── follow.js        # Follow/unfollow API
    ├── users.js             # Get all users
    └── create-sample-profiles.js # Sample data creation

models/
└── User.js                  # Enhanced user schema

components/
├── Navbar.jsx               # Updated with profile links
└── ui/                      # Reusable UI components

styles/
└── globals.css              # Custom CSS utilities
```

## Usage Examples

### View Your Profile
```javascript
// Navigate to your own profile
router.push('/profile/me');
```

### View Another User's Profile
```javascript
// Navigate to specific user's profile
router.push(`/profile/${userId}`);
```

### Follow/Unfollow User
```javascript
const handleFollow = async () => {
  const response = await fetch('/api/profile/follow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: targetUserId,
      action: isFollowing ? 'unfollow' : 'follow',
      currentUserId: session.user.id
    }),
  });
};
```

### Fetch Profile Data
```javascript
const fetchProfile = async () => {
  const response = await fetch(`/api/profile/${userId}`);
  const data = await response.json();
  // data.user - user information
  // data.stats - follower/following/posts counts
  // data.posts - user's posts
  // data.isFollowing - follow status
  // data.isOwnProfile - own profile flag
};
```

## Sample Data

The system includes sample profile creation with realistic data:
- **Sarah Johnson** - UI/UX Designer (Verified)
- **Mike Chen** - Frontend Developer
- **Emma Wilson** - Product Designer (Verified)

Each sample profile includes:
- Professional bio
- Location information
- Website links
- Sample posts
- Realistic follower/following counts

## Styling Features

- **Dribbble-Inspired Design**: Clean, minimal aesthetic
- **Hover Effects**: Subtle animations and transitions
- **Card-Based Layout**: Consistent card components
- **Responsive Grid**: Adapts to different screen sizes
- **Custom Utilities**: Line-clamp for text truncation
- **Icon Integration**: Lucide React icons throughout

## Security Considerations

- **Password Exclusion**: User passwords never returned in API responses
- **Authentication Checks**: Follow actions require valid sessions
- **Input Validation**: Proper validation on all API endpoints
- **Error Handling**: Graceful error handling throughout

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live follower counts
- **Advanced Messaging**: Full chat system implementation
- **Profile Customization**: Cover image upload and customization
- **Social Features**: Comments, likes, and shares on profiles
- **Search & Filtering**: Advanced profile discovery features

## Getting Started

1. **Create Sample Data**: Visit `/api/create-sample-profiles` to populate test data
2. **Browse Profiles**: Navigate to `/profiles` to see all user profiles
3. **View Individual Profiles**: Click on any profile to see the full Dribbble-style layout
4. **Test Authentication**: Login and visit `/profile/me` to see your own profile

The profile system is now fully functional and ready for production use!
