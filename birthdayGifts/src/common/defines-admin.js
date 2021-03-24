

export const MENU_ADMIN = {
  authority:['ADMIN'],
  route: [
    {
      id:1,
      name: "Dashboard",
      slug: "dashboard",
      iconName: "homeIcon", 
    },
    {
      id:2,
      name: "Cards",
      slug: "cards",
      iconName: "cardsIcon", 
    },
    {
      id:3,
      name: "Invitations",
      slug: "invitations",
      iconName: "invitationIcon", 
    },
    {
      id:4,
      name: "Gifts",
      slug: "gifts",
      iconName: "giftsIcon", 
    },
    
    {
      id:5,
      name: "Categories",
      slug: "categories",
      iconName: "categoryIcon", 
    },
    {
      id:6,
      name: "Tags",
      slug: 'tags',
      iconName: "tagIcon", 
    },
    {
      id:7,
      name: "Users",
      slug: "users",
      iconName: "usersIcon", 
    },
  ],
};



export const MENU_GUEST = {
  authority:['GUEST'],
  route: [
    {
      id:2,
      name: "Cards",
      slug: "cards",
      iconClass: "icon-accessories", 
    },
    {
      id:3,
      name: "Invitations",
      slug: "invitations",
      iconClass: "icon-accessories", 
    },
    {
      id:4,
      name: "Gifts",
      slug: 'gifts',
      iconClass: "icon-accessories", 
    },
    /* 
    /// Suggestion
    {
      id:5,
      name: "Flyers",
      slug: "flyers",
      iconClass: "icon-accessories", 
    }, */
  ],
};

export const Categories = {
  name:'Occasion',
  ref:'cards',
  sub:[
    'Anniversary',
    'Good Luck',
    'New Baby',
    'Wedding',
    'Teacher Appriciation'
  ]
}
