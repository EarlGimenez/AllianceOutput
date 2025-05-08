// UserIcon component, now able to accept className as a prop

type UserIconProps = {
    className?: string; // Define className as an optional prop
  };
  
  const UserIcon = ({ className }: UserIconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className} // Apply the className prop
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
  
  export default UserIcon; // Export default so you can import it as before
  