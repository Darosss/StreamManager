export const routes = [
  {
    title: "Core",
    description: "Essential stream management",
    routes: [
      { path: "/", label: "Stream Manager", icon: "📡" },
      { path: "/overlay", label: "Overlay", icon: "🎨" },
      { path: "/stream-sessions", label: "Sessions", icon: "📊" },
    ],
  },
  {
    title: "Content",
    description: "Messages and events",
    routes: [
      { path: "/messages", label: "Messages", icon: "💬" },
      { path: "/message-categories", label: "Categories", icon: "📁" },
      { path: "/events", label: "Events", icon: "⚡" },
    ],
  },
  {
    title: "Modes",
    description: "Stream customization",
    routes: [
      { path: "/modes/moods", label: "Moods", icon: "😊" },
      { path: "/modes/affixes", label: "Affixes", icon: "🏷️" },
      { path: "/modes/tags", label: "Tags", icon: "🔖" },
    ],
  },
  {
    title: "Media",
    description: "Content and achievements",
    routes: [
      { path: "/achievements", label: "Achievements", icon: "🏆" },
      { path: "/songs", label: "Songs", icon: "🎵" },
    ],
  },
  {
    title: "Automation",
    description: "Bots and triggers",
    routes: [
      { path: "/commands", label: "Commands", icon: "⌨️" },
      { path: "/triggers", label: "Triggers", icon: "🎯" },
      { path: "/timers", label: "Timers", icon: "⏰" },
      { path: "/redemptions", label: "Redemptions", icon: "🎁" },
    ],
  },
  {
    title: "Management",
    description: "Users and settings",
    routes: [
      { path: "/users", label: "Users", icon: "👥" },
      { path: "/configs", label: "Configs", icon: "⚙️" },
    ],
  },
];
