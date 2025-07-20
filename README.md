# Community Debate Arena — Battle of Opinions

Welcome to **Community Debate Arena**, a dynamic platform where users can create, join, and engage in structured debates by taking a stance—Support or Oppose. Participants post arguments, vote on compelling responses, and compete for a spot on the leaderboard, all while an auto-moderation system ensures respectful discourse.

## Features

### Core Features
1. **Debate Creation**
   - Authenticated users can create debates with:
     - Title
     - Description
     - Tags (e.g., tech, ethics)
     - Category
     - Image/banner
     - Debate duration (e.g., 1 hour, 12 hours, 24 hours)

2. **Join a Debate**
   - Users choose one side: Support or Oppose
   - Restriction: Users cannot join both sides of the same debate

3. **Argument Posting**
   - Post arguments under the chosen side
   - Each argument displays:
     - Author info
     - Timestamp
     - Vote count
     - Edit/delete option (available within 5 minutes of posting)

4. **Voting System**
   - One vote per argument per user
   - Supports upvote/downvote or single "Vote" button

5. **Debate Countdown and Auto-Close**
   - Debates have a countdown timer
   - On expiration:
     - Argument posting is disabled
     - Voting is disabled
     - Side with the highest total votes wins

6. **Scoreboard**
   - Public leaderboard displaying:
     - Username
     - Total votes received across arguments
     - Number of debates participated in
     - Filters: weekly, monthly, all-time

7. **Auto-Moderation**
   - Checks arguments for banned words (e.g., "stupid", "idiot", "dumb")
   - Prevents submission and shows a warning if inappropriate words are detected

### Bonus Features
- **Reply Timer**: Users must post their first argument within 5 minutes of joining a side
- **Dark Mode**: Toggle between dark and light themes
- **Mobile-Optimized UI**: Responsive design for all screen sizes
- **Public Debate Sharing**: Share debates via public URLs
- **Search Debates**: Filter by title, tag, or category; sort by most voted, newest, or ending soon
- **Debate Summary Generator**: Displays a static or mock AI-generated summary of debate outcomes

## Tech Stack
- **Next.js 15** (App Router)
- **Tailwind CSS** for styling
- **NextAuth.js** for authentication
- **Zod + React Hook Form** for form validation

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A configured NextAuth.js provider (e.g., Google, GitHub)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/community-debate-arena.git
   cd community-debate-arena
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   # Add your authentication provider credentials
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
