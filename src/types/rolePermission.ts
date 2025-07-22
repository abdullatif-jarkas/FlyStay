// Role and Permission Management TypeScript interfaces

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  roles?: Role[];
  permissions?: Permission[];
}

export interface Role {
  id: number;
  name: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
  permissions?: Permission[];
  users?: User[];
}

export interface Permission {
  id: number;
  name: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
  roles?: Role[];
  users?: User[];
}

// API Request interfaces
export interface AssignRoleToUserRequest {
  user_id: number;
  name: string; // role name
}

export interface RemoveRoleFromUserRequest {
  user_id: number;
  name: string; // role name
}

export interface AssignPermissionToUserRequest {
  user_id: number;
  permission_name: string;
}

export interface RemovePermissionFromUserRequest {
  user_id: number;
  permission_name: string;
}

export interface AssignPermissionToRoleRequest {
  role_name: string;
  permission_name: string;
}

export interface RemovePermissionFromRoleRequest {
  role_name: string;
  permission_name: string;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  status: string;
  message?: string;
  data?: T;
  errors?: { [key: string]: string[] };
}

export interface UsersResponse extends ApiResponse {
  data: User[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_results: number;
    per_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

export interface RolesResponse extends ApiResponse {
  data: Role[];
}

export interface PermissionsResponse extends ApiResponse {
  data: Permission[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_results: number;
    per_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

// Modal Props interfaces
export interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
  availableRoles: Role[];
}

export interface RemoveRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
  roleToRemove: Role | null;
}

export interface AssignPermissionToUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
  availablePermissions: Permission[];
}

export interface RemovePermissionFromUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
  permissionToRemove: Permission | null;
}

export interface AssignPermissionToRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: Role | null;
  availablePermissions: Permission[];
}

export interface RemovePermissionFromRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: Role | null;
  permissionToRemove: Permission | null;
}

// Utility types
export interface RolePermissionAction {
  type:
    | "assign_role"
    | "remove_role"
    | "assign_permission_to_user"
    | "remove_permission_from_user"
    | "assign_permission_to_role"
    | "remove_permission_from_role";
  user?: User;
  role?: Role;
  permission?: Permission;
}

// Form data interfaces for API calls
export interface RolePermissionFormData {
  user_id?: number;
  name?: string;
  permission_name?: string;
  role_name?: string;
}

// Constants
export const ROLE_PERMISSION_ENDPOINTS = {
  ASSIGN_ROLE: "http://127.0.0.1:8000/api/assign-role",
  REMOVE_ROLE: "http://127.0.0.1:8000/api/remove-role",
  ASSIGN_PERMISSION_TO_USER:
    "http://127.0.0.1:8000/api/assign-permission-to-user",
  REMOVE_PERMISSION_FROM_USER:
    "http://127.0.0.1:8000/api/remove-permission-from-user",
  ASSIGN_PERMISSION_TO_ROLE:
    "http://127.0.0.1:8000/api/assign-permission-to-role",
  REMOVE_PERMISSION_FROM_ROLE:
    "http://127.0.0.1:8000/api/remove-permission-from-role",
  USERS: "http://127.0.0.1:8000/api/user",
  DELETE_USER: "http://127.0.0.1:8000/api/user",
  ROLES: "http://127.0.0.1:8000/api/role",
  PERMISSIONS: "http://127.0.0.1:8000/api/permission",
} as const;

// Helper function types
export interface RolePermissionUtils {
  createFormData: (data: RolePermissionFormData) => FormData;
  getAuthHeaders: () => { Authorization: string; Accept: string };
  handleApiError: (error: any) => string;
}

// Action button configurations
export interface RolePermissionActionButton {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  variant: "primary" | "secondary" | "danger" | "success";
  disabled?: boolean;
}
