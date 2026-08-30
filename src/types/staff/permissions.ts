export interface ISecurityDomainPermission {
  domainId: string;
  domainName: string;
  description: string;
  superAdmin: boolean;
  customerCare: boolean;
  inventory: boolean;
  logistics: boolean;
}
