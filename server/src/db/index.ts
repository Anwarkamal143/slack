export enum Role {
  USER = "user",
  ADMIN = "admin",
}
export type IRole = `${Role}`;
export enum ProviderType {
  email = "email",
  google = "google",
  github = "github",
  linkedIn = "linkedIn",
}
export enum AccountType {
  oauth = "oauth",
  email = "email",
}
export type IAccountType = `${AccountType}`;
export enum WorkSpaceMemberRole {
  admin = "admin",
  member = "member",
  guest = "guest",
  moderator = "moderator",
}
export type IWorkSpaceMemberRole = `${WorkSpaceMemberRole}`;

export enum WorkspacePublishStatuses {
  public = "public",
  private = "private",
  draft = "draft",
}
export type IWorkspacePublishStatuses = `${WorkspacePublishStatuses}`;
