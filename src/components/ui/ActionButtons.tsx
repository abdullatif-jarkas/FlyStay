import React from "react";
import { FiEdit, FiTrash2, FiEye, FiMoreHorizontal } from "react-icons/fi";
import { ActionButtonProps, ActionButtonsProps } from "../../types/ActionButton";

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon,
  label,
  variant = "secondary",
  disabled = false,
}) => {
  const baseClasses =
    "p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    secondary: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
    danger: "text-red-600 hover:bg-red-50 focus:ring-red-500",
    success: "text-green-600 hover:bg-green-50 focus:ring-green-500",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} cursor-pointer`}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  );
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  actions,
  compact = false,
  onView,
  onEdit,
  onDelete,
  additionalActions = [],
}) => {
  // Build actions array from props if not provided directly
  const allActions = actions || [
    ...(onView ? [createViewAction(onView)] : []),
    ...(onEdit ? [createEditAction(onEdit)] : []),
    ...(onDelete ? [createDeleteAction(onDelete)] : []),
    ...additionalActions,
  ];

  if (compact && allActions.length > 3) {
    // Show first 2 actions and a dropdown for the rest
    const visibleActions = allActions.slice(0, 2);
    const hiddenActions = allActions.slice(2);

    return (
      <div className="flex items-center gap-1">
        {visibleActions.map((action, index) => (
          <ActionButton key={index} {...action} />
        ))}
        <div className="relative group">
          <button className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
            <FiMoreHorizontal className="w-4 h-4" />
          </button>
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[120px]">
            {hiddenActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 first:rounded-t-md last:rounded-b-md disabled:opacity-50 disabled:cursor-not-allowed"
                title={action.label}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {allActions.map((action, index) => (
        <ActionButton key={index} {...action} />
      ))}
    </div>
  );
};

// Predefined common action buttons
export const createViewAction = (onClick: () => void): ActionButtonProps => ({
  onClick,
  icon: <FiEye className="w-4 h-4" />,
  label: "View",
  variant: "primary",
});

export const createEditAction = (onClick: () => void): ActionButtonProps => ({
  onClick,
  icon: <FiEdit className="w-4 h-4" />,
  label: "Edit",
  variant: "secondary",
});

export const createDeleteAction = (onClick: () => void): ActionButtonProps => ({
  onClick,
  icon: <FiTrash2 className="w-4 h-4" />,
  label: "Delete",
  variant: "danger",
});

export default ActionButtons;
