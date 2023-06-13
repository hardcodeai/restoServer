const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

let restaurantNames = [
  {name:'The Cheesecake Factory',img:'https://generatorfun.com/code/uploads/Random-Restaurant-image-11.jpg'},
  {name:'Chili\'s',img:'https://generatorfun.com/code/uploads/Random-Restaurant-image-15.jpg'},
  {name:'Olive Garden',img:'https://generatorfun.com/code/uploads/Random-Restaurant-image-19.jpg'},
  {name:'Red Lobster',img:'https://generatorfun.com/code/uploads/Random-Restaurant-image-1.jpg'},
  {name:'TGI Fridays',img:'https://generatorfun.com/code/uploads/Random-Restaurant-image-3.jpg'},
  {name:'Applebee\'s',img:'https://generatorfun.com/code/uploads/Random-Restaurant-image-5.jpg'},
  {name:'Outback Steakhouse',img:'https://generatorfun.com/code/uploads/Random-Restaurant-image-6.jpg'},
  {name:'Texas Roadhouse',img:'https://generatorfun.com/code/uploads/Random-Restaurant-image-7.jpg'},
  {name:'Buffalo Wild Wings',img:'https://generatorfun.com/code/uploads/Random-Restaurant-image-8.jpg'},
]

let menuItemNames = [
    {name:'Pizza','image':'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'},
    {name:'Burger',image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1398&q=80'},
    {name:'Pasta',image:'https://plus.unsplash.com/premium_photo-1673809798970-30c14cfd0ab6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFzdGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'},
    {name:'Salad',image:'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2FsYWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'},
    {name:'Sushi',image:'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'},
    {name:'Steak',image:'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RlYWt8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'},
    {name:'Sandwich',image:'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FuZHdpY2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'},
    {name:'Tacos',image:'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGFjb3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'},
    {name:'Chicken Curry',image:'https://images.unsplash.com/photo-1627366422957-3efa9c6df0fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2hpY2tlbiUyMGN1cnJ5JTVDfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'},
    {name:'Fish and Chips',image:'https://images.unsplash.com/photo-1579208030886-b937da0925dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmlzaCUyMGFuZCUyMGNoaXBzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'},
    {name:'Ramen',image:'https://images.unsplash.com/photo-1526318896980-cf78c088247c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFtZW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'},
    {name:'Fried Rice',image:'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJpZWQlMjByaWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'},
    {name:'Burrito',image:'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YnVycml0b3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'},
    {name:'Ice Cream',image:'https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGljZSUyMGNyZWFtfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'},
]






async function populateData() {
  try {
    // Clear existing data
    // await Restaurant.deleteMany();
    // await MenuItem.deleteMany();

    let prevRestaurants = await Restaurant.find({}).exec();
    let prevMenuItems = await MenuItem.find({}).exec();

    // if(prevRestaurants.length > 0 && prevMenuItems.length > 0) return

    // Generate restaurants
    const restaurants = [];
    for (let i = 0; i < restaurantNames.length; i++) {
      const restaurant = new Restaurant({
        name: restaurantNames[i].name,
        image: restaurantNames[i].img,
      });
      restaurants.push(restaurant);
    }
    if(!prevRestaurants.length) await Restaurant.insertMany(restaurants);

    // Generate menu items for each restaurant
    for (const restaurant of restaurants) {
      const menuItems = [];
      const menuLength = Math.floor(Math.random() * menuItemNames.length) + 1;

      for (let i = 0; i < menuLength; i++) {
        const menuItem = new MenuItem({
          name: menuItemNames[i].name,
          price: Math.floor(Math.random() * 100),
          restaurant: restaurant._id,
          image: menuItemNames[i].image,
        });
        menuItems.push(menuItem);
      }
      if(!prevMenuItems.length) await MenuItem.insertMany(menuItems);
    }

  } catch (error) {
    console.error('Error populating data:', error);
  }
}

module.exports.populateData = populateData;
