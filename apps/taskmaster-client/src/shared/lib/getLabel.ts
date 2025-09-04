export const getLabel = (status: string) => {
  switch (status) {
    case "TODO":
      return "📋 To Do";
    case "IN_PROGRESS":
      return "🚧 In Progress";
    case "DONE":
      return "✅ Done";
    case "PENDING_REVIEW":
      return "🕵️ Review";
    default:
      return status;
  }
};
