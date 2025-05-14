export const API_ROUTES = {
  AUTH: {
    LOGIN: "platform-admin/login/",
  },
  USERS: {
    LIST: "platform-admin/users/",
    USEDETAILS: "platform-admin/user-detail/",
    PURCHASEHISTORY: "platform-admin/users/purchase-history/",
    CREDITUSAGE: "platform-admin/users/credits-usage-history/",
    JOBLIST: "platform-admin/list-jobs/",
  },
  PRICING: {
    CREATEPRICE: "/platform-admin/create-pricing/",
    GETPRICELIST: "/platform-admin/list-pricing/",
    UPDATEPRICE: "/platform-admin/update-pricing/",
    DELETEPRICE: "/platform-admin/delete-pricing/",
    COMPANYLIST: "/platform-admin/list-company/",
  },
  PRIVACY: {
    GETPRIVACY:"/platform-admin/site-content/",
    UPDATEPRIVACY:"/platform-admin/update-site-content/",
  },
  CONTACTUS: {
    GETCONTACTUS:"/platform-admin/contact-us-list/",
    UPDATECONTACTUS:"/platform-admin/contact-us-reviewed/",
  }
};

export const PAGE_ROUTES = {
  DASHBOARD: "/usermamagement",
  USERLIST: "/usermamagement/user-list",
  PURCHASEHISTORY: "/usermamagement/purchase-history",
  CREDITUSAGE: "/usermamagement/credit-usage",
  JOBLIST: "/usermamagement/job-list",
  PRICELIST: "/price-list",
  PRIVACYANDTERMS: "/privacy-terms",
  CONTACTUS: "/contact-us"
};
