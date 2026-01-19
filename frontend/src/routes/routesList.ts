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
      { path: "/songs", label: "Songs", icon: "🎵" },
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
    title: "Achievements",
    description: "Achievement  based",
    routes: [
      { path: "/achievements/list", label: "Achievements", icon: "🏆" },
      { path: "/achievements/badges", label: "Badges", icon: "🥇" },
      {
        path: "/achievements/badges/images",
        label: "Badges Images",
        icon: "📷",
      },
      { path: "/achievements/stages", label: "Stages", icon: "📂" },
      {
        path: "/achievements/stages/sounds",
        label: "Stages sounds",
        icon: "🎵",
      },
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
