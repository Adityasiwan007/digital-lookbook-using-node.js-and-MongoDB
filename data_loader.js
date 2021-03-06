let mongoose = require('mongoose')
let User = require('./models/user')
let Club = require('./models/club')
let Product = require('./models/product')
let vid = require('./models/video_structure')
let video_product = require('./models/video_pro_structure')
let pro_data=require('./video_pro_details.json')
let vid_data=require('./video_product.json')
let storeDate = require('./store_data.json')
var config = require('./config');
let RetailStore = require('./models/retail_store')
function loadData(){
    storeDate.products.forEach(async product => {
        let doc = new Product(product)
        await doc.save()
        console.log(`saved product ${product.name}`)
    });

    vid_data.videos.forEach(async data => {
        let doc = new vid(data)
        await doc.save()
        console.log(`saved video detail ${data.name}`)
    });

    pro_data.vid_products.forEach(async data => {
        let doc = new video_product(data)
        await doc.save()
        console.log(`saved video detail ${data.name}`)
    });
    
    storeDate.clubs.forEach(async club=>{
        let doc = new Club(club)
        await doc.save()
        console.log(`saved club ${club.name}`)
    })
    
    storeDate.users.forEach(async user=>{
        let firstNameLower = (user.firstName ? user.firstName: "").toLowerCase()
        let lastNameLower =  (user.lastName ? user.lastName: "").toLowerCase()
        let doc = new User({...user,firstNameLower,lastNameLower,club:{clubID:user.club?user.club.clubID:'',joinedOn:new Date()}})
        if(!(doc.profilePic && doc.profilePic.name)){
            doc.profilePic = {name:'profile.png',url:`${config.profilePicUrlPrefix}/profile.png`}
        }
        await doc.save()
        console.log(`saved user ${user.userName}`)
    })
    storeDate.stores.forEach(async store=>{
        let doc = new RetailStore(store)
        await doc.save()
        console.log(`saved store ${doc.name}`)
    })
}
mongoose.connect(config.mongodb, { server: { reconnectTries: Number.MAX_VALUE } }, function(err) {
    if (err) {
        console.log('info', 'Couldnt connect to MongoDB:', err);
    } else {
        console.log('info', 'Connected to MongoDB');
        loadData()
    }
});
