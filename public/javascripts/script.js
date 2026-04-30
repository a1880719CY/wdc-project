// setting variable here
var sMTheme = localStorage.getItem('sMTheme') || 'dark';
var tNum = localStorage.getItem('twitterPostID') || '1792499204793000406';
var intgPNum1 = localStorage.getItem('instagramPostID1') || 'https://www.instagram.com/p/C8DfSP7Bwlr/';
var intgPNum2 = localStorage.getItem('instagramPostID2') || 'https://www.instagram.com/p/C7EAy5LLfhD/';



// Define the function to open the Instagram post
function openInstaPost1() {
  window.open(intgPNum1, '_blank');
}

// Define the function to open the Instagram post
function openInstaPost2() {
  window.open(intgPNum2, '_blank');
}

//function here
function checkTwttrReady(attempt, maxAttempts, retryInterval) {
  attempt++;
  if (window.twttr && window.twttr.ready) {
    window.twttr.ready(function (twttr) {
      embedTweet();
    });
  } else if (attempt < maxAttempts) {
    setTimeout(checkTwttrReady, retryInterval);
  } else {
    console.error('Twitter widgets.js failed to load.');
  }
}

function embedInstagramPost(tagName, tUrl) {
  const igContainer = document.getElementById(tagName);
  const instagramPostURL = tUrl;  // Replace with the actual Instagram post URL

  // Create a blockquote element with the necessary attributes
  const blockquote = document.createElement('blockquote');
  blockquote.className = 'instagram-media';
  blockquote.setAttribute('data-instgrm-permalink', instagramPostURL);
  blockquote.setAttribute('data-instgrm-version', '14');
  blockquote.style.maxWidth = '540px';
  blockquote.style.width = '100%';

  // Append the blockquote to the container
  igContainer.appendChild(blockquote);

  // Create and append the Instagram embed script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.instagram.com/embed.js';
  document.body.appendChild(script);

  // Log a message to the console once the post is embedded
  script.onload = function() {
      console.log('Instagram post added.');
  };

  // Handle any errors that occur while adding the script
  script.onerror = function(error) {
      console.error('Error adding Instagram post:', error);
  };
}

function embedTweet() {
  // eslint-disable-next-line no-undef
  twttr.widgets.createTweet(
    tNum,  // Replace with the actual Tweet ID
    document.getElementById('tweetContainer'),
    {
      theme: sMTheme  // Optional: customization options
    }
  ).then(function (el) {
    console.log('Tweet added.');
  }).catch(function (error) {
    console.error('Error adding tweet:', error);
  });
}

 // Validate Twitter ID
 function isValidTwitterID(id) {
  return /^\d{1,20}$/.test(id); // Check if the ID is a number and has 1 to 20 digits
}

// Validate Instagram URL
function isValidInstagramURL(url) {
  return /^https:\/\/www\.instagram\.com\/p\/[A-Za-z0-9_-]+\/?$/.test(url);
}



// Function to update social media variables
function updateSocialMediaVariables(twitterID, instaID1, instaID2) {
  try {
    let updated = false;

    if (twitterID && isValidTwitterID(twitterID)) {
      tNum = twitterID;
      localStorage.setItem('twitterPostID', tNum);
      console.log('Twitter Post ID updated to:', tNum);
      updated = true;
    }

    if (instaID1 && isValidInstagramURL(instaID1)) {
      intgPNum1 = instaID1;
      localStorage.setItem('instagramPostID1', intgPNum1);
      console.log('Instagram Post ID 1 updated to:', intgPNum1);
      updated = true;
    }

    if (instaID2 && isValidInstagramURL(instaID2)) {
      intgPNum2 = instaID2;
      localStorage.setItem('instagramPostID2', intgPNum2);
      console.log('Instagram Post ID 2 updated to:', intgPNum2);
      updated = true;
    }

    if (updated) {
      const systemMessage = document.querySelector('.systemMessage');
      if (systemMessage) {
        systemMessage.textContent = 'Social media posts updated successfully!';
        systemMessage.style.color = 'green';
      }
    } else {
      const systemMessage = document.querySelector('.systemMessage');
      if (systemMessage) {
        systemMessage.textContent = 'Please enter valid values.';
        systemMessage.style.color = 'red';
      }
    }

  } catch (error) {
    console.error('Error updating social media variables:', error);
  }
}







//Vue needed
const SPECIALS = [
  { name: 'Koala', scientific_name:'Phascolarctos cinereus', description: 'Threatened primarily due to habitat loss, wildfires, and disease.', image: '../assets/images/profileImage/Profile_Koala.jpg' },

  { name: 'Leadbeater\'s Possum', scientific_name:'Gymnobelideus leadbeateri', description: 'Faces threats from habitat destruction and logging in Victoria\'s mountain ash forests.', image: '../assets/images/profileImage/Profile_LeadbeatersPossum.jpg' },

  { name: 'Northern Hairy-nosed Wombat', scientific_name:'Lasiorhinus krefftii', description: 'Critically endangered due to habitat loss and competition with livestock.', image: '../assets/images/profileImage/Profile_NorthernHairyNosedWombat.jpg' },

  { name: 'Orange-bellied Parrot', scientific_name:'Neophema chrysogaster', description: 'One of Australia\'s rarest birds, facing habitat destruction and predation.', image: '../assets/images/profileImage/Profile_OrangeBelliedParrot.jpg' },

  { name: 'Western Swamp Tortoise', scientific_name:'Pseudemydura umbrina', description: 'Critically endangered due to habitat loss, degradation, and introduced predators.', image: '../assets/images/profileImage/Profile_WesternSwampTortoise.jpg' },

  { name: 'Greater Stick-nest Rat', scientific_name:'Leporillus conditor', description: 'Critically endangered due to habitat loss and competition with introduced species like rabbits and feral cats.', image: '../assets/images/profileImage/Profile_GreaterStickNestRat.jpg' },

  { name: 'Helmeted Honeyeater', scientific_name:'Lichenostomus melanops cassidix', description: 'Threatened by habitat loss, fragmentation, and invasive species.', image: '../assets/images/profileImage/Profile_HelmetedHoneyeater.jpg' },

  { name: 'Gilbert\'s Potoroo', scientific_name:'Potorous gilbertii', description: 'One of the rarest marsupials in the world, threatened by habitat loss and introduced predators.', image: '../assets/images/profileImage/Profile_GilbertsPotoroo.jpg' },

  { name: 'Carpentarian Rock Rat', scientific_name:'Zyzomys palatalis', description: 'Critically endangered due to habitat degradation and predation by feral cats.', image: '../assets/images/profileImage/Profile_CarpentarianRockRat.jpg' },

  { name: 'Christmas Island Flying Fox', scientific_name:'Pteropus natalis', description: 'Faces threats from habitat destruction, introduced predators, and disease.', image: '../assets/images/profileImage/Profile_ChristmasIslandFlyingFox.jpg' },
];

import header from  "./components/header.js"

// eslint-disable-next-line no-undef
const vueinst = new Vue({
  el: '#app',
  components:{
    'app-header':header,
  },
  data: {
    special: SPECIALS[0],
    slideIndex: 1,
    currentIndex: 0,
    darkMode: false,
    slides: [
      {
      hero_image: '../assets/images/heroImage/Hero_Koala.jpg',
      },
      {
        hero_image: '../assets/images/heroImage/Hero_LeadbeatersPossum.jpg',
      },
      {
        hero_image: '../assets/images/heroImage/Hero_NorthernHairyNosedWombat.jpg',
      },
      {
        hero_image: '../assets/images/heroImage/Hero_OrangeBelliedParrot.jpg',
      },
      {
        hero_image: '../assets/images/heroImage/Hero_WesternSwampTortoise.jpg',
      },
      {
        hero_image: '../assets/images/heroImage/Hero_GreaterStickNestRat.jpg',
      },
      {
        hero_image: '../assets/images/heroImage/Hero_HelmetedHoneyeater.jpg',
      },
      {
        hero_image: '../assets/images/heroImage/Hero_GilbertsPotoroo.jpg',
      },
      {
        hero_image: '../assets/images/heroImage/Hero_CarpentarianRockRat.jpg',
      },
      {
        hero_image: '../assets/images/heroImage/Hero_ChristmasIslandFlyingFox.jpg',
      },
    ],
    people: [
      { name: 'Chris', bio: 'Bio 1', image: '../assets/images/personalIcon/Chris.jpg' },
      { name: 'Jason', bio: 'Bio 2', image: '../assets/images/personalIcon/Jason.jpg' },
      { name: 'Eric', bio: 'Bio 3', image: '../assets/images/personalIcon/Eric.jpg' },
      { name: 'Person 4', bio: 'Bio 4', image: '../assets/images/personalIcon/IDK.jpg' },

  ],
    userInfo:{},
    //login.html
    isLogin:true,
    loginForm:{
      username:'',
      password:'',
      fullName:'',
      email:'',
      role:'1',
    },
    //volunteerOrg.html
    isflag1:false,
    volunteerOrgList:[],
    locationHref:window.location.href,
    index1:1,
    index:0,
    //orgDetails.html
  volunteerManagerInfo:{},
  },

  computed: {
    specialPageLink() {
      return `/animals/${this.special.name.replace(/\s+/g, '-').toLowerCase()}.html`;
    }
  },

  created() {
    if(localStorage.getItem("userInfo")){
      this.userInfo=JSON.parse(localStorage.getItem("userInfo"))
    }
    if(this.locationHref.indexOf('volunteerOrg.html')!=-1){
      this.getVolunteerOrgList()
    }else if(this.locationHref.indexOf('orgDetails.html')!=-1){
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      this.getVolunteerOrgList(id)
    }else if(this.locationHref.indexOf('personalCenter.html')!=-1){
      this.loginForm=this.userInfo
    }

  },
  methods: {
    preserve(){

      if (confirm("Are you sure you want to join?")) {
        ajax({
          method: "put",
          url:'admin/updateUser' ,
          dataType: "json",
          data:JSON.stringify(this.loginForm),
          headers: { "Authorization": localStorage.getItem('token'),"Content-Type": "application/json"},
          success: (res) => {
            if(res.code==200){
              this.handlerOut()
              alert(res.message)
            }else if(res.err){
              alert(res.err)
            }else if(res.message=='Authentication failed! Please carry a token in the request header'){
              this.handlerOut()
            }{
            }
          },
          error: (err) => {
              console.log(err)
          }
        })
      } else {
      }
    },
    //joinOrg
    joinOrg(item){
      if (confirm("Are you sure you want to join?")) {
        ajax({
          method: "post",
          url:'/org/joinVolunteerOrg' ,
          dataType: "json",
          data:JSON.stringify({volunteerOrgId:item.id}),
          headers: { "Authorization": localStorage.getItem('token'),"Content-Type": "application/json"},
          success: (res) => {
            if(res.code==200){
              alert(res.message)
            }else if(res.err){
              alert(res.err)
            }else if(res.message=='Authentication failed! Please carry a token in the request header'){
              this.handlerOut()
            }{
            }
          },
          error: (err) => {
              console.log(err)
          }
        })
      } else {
      }

    },
    getVolunteerManagerInfo(id){
      let url='/admin/getVolunteerManager'
      if(id){
        url+=('?id='+id)
      }
      ajax({
        method: "get",
        url:url ,
        dataType: "json",
        headers: { "Authorization": localStorage.getItem('token')},
        success: (res) => {
          if(res.code==200){
            this.volunteerManagerInfo=res.data[0]
          }else if(res.message=='Authentication failed! Please carry a token in the request header'){
            this.handlerOut()
          }{
          }
        },
        error: (err) => {
            console.log(err)
        }
      })
    },
    getVolunteerOrgList(id){
      let url='/org/getVolunteerOrg'
      if(id){
        url+=('?id='+id)
      }
      ajax({
        method: "get",
        url:url ,
        dataType: "json",
        headers: { "Authorization": localStorage.getItem('token')},
        success: (res) => {
          if(res.code==200){
            this.volunteerOrgList=res.data
            if(id){
              this.getVolunteerManagerInfo(this.volunteerOrgList[0].volunteerManagerId)
            }
          }else if(res.message=='Authentication failed! Please carry a token in the request header'){
            this.handlerOut()
          }{
          }
        },
        error: (err) => {
            console.log(err)
        }
      })
    },
    handlerOut(){
        localStorage.removeItem("token")
        localStorage.removeItem("userInfo")
        localStorage.removeItem("role")
        this.loginForm={
        username:'',
        password:'',
        fullName:'',
        email:'',
        role:'1',
        }
        this.userInfo={}
        window.location.href = 'login.html';

    },
    handleGet(row){
      console.log(row)
      window.location.href = 'orgDetails.html?id='+ row.id
    },
    register(str){
      console.log(str)
      if(str=='login'){
        this.isLogin=true
      }else if(str=='register'){
        this.isLogin=false
      }
      this.loginForm={
        username:'',
        password:'',
        fullName:'',
        email:'',
        role:'1',
      }

    },
     loginSubmit(str){
      const message = new messageControl().message
      console.log(str,this.loginForm.role)
      if(str=='login'){
        if(this.loginForm.role=="1"){
          ajax({
            method: "post",
            url: "/users/login",
            dataType: "json",
            headers: { "Content-Type": "application/json" },
            data:JSON.stringify({username:this.loginForm.username,password:this.loginForm.password}),
            success: (res) => {
              if(res.code==200){
                localStorage.setItem("token",res.data.token)
                localStorage.setItem("userInfo",JSON.stringify(res.data))
                localStorage.setItem("role",1)
                window.location.href = 'index.html';
                alert(res.message)
              }else{
                alert(res.message)
              }
            },
            error: (err) => {
                console.log(err)
            }
        })
        }else if(this.loginForm.role=="2"){
          ajax({
            method: "post",
            url: "/users/volunteerManagerLogin",
            dataType: "json",
            headers: { "Content-Type": "application/json" },
            data:JSON.stringify({volunteerName:this.loginForm.username,password:this.loginForm.password}),
            success: (res) => {
              if(res.code==200){
                localStorage.setItem("token",res.data.token)
                localStorage.setItem("userInfo",JSON.stringify(res.data))
                localStorage.setItem("role",2)
                window.location.href = 'index.html';
                alert(res.message)
              }else{
                alert(res.message)
              }
            },
            error: (err) => {
                console.log(err)
            }
          })
        }else if(this.loginForm.role=="3"){
          ajax({
            method: "post",
            url: "/users/adminLogin",
            dataType: "json",
            headers: { "Content-Type": "application/json" },
            data:JSON.stringify({name:this.loginForm.username,password:this.loginForm.password}),
            success: (res) => {
              if(res.code==200){
                localStorage.setItem("token",res.data.token)
                localStorage.setItem("userInfo",JSON.stringify(res.data))
                localStorage.setItem("role",3)
                window.location.href = 'index.html';
                alert(res.message)
              }else{
                alert(res.message)
              }
            },
            error: (err) => {
                console.log(err)
            }
          })
      }
      }else if(str =='register'){
        if(this.loginForm.role=="1"){
          ajax({
            method: "post",
            url: "/users/addUser",
            dataType: "json",
            headers: { "Content-Type": "application/json" },
            data:JSON.stringify({username:this.loginForm.username,fullName:this.loginForm.fullName,password:this.loginForm.password,email:this.loginForm.email}),
            success: (res) => {
              if(res.code==200){
                this.isLogin=true
                alert(res.message)
              }else{
                alert(res.message)
              }
            },
            error: (err) => {
                console.log(err)
            }
        })
        }else if(this.loginForm.role=="2"){
          ajax({
            method: "post",
            url: "/users/addVolunteerManager",
            dataType: "json",
            headers: { "Content-Type": "application/json" },
            data:JSON.stringify({volunteerName:this.loginForm.username,fullName:this.loginForm.fullName,password:this.loginForm.password}),
            success: (res) => {
              if(res.code==200){
                this.isLogin=true
                alert(res.message)
              }else{
                alert(res.message)
              }
            },
            error: (err) => {
                console.log(err)
            }
          })
        }
      }
    },
    nextAnimal() {
      this.currentIndex = (this.currentIndex + 1) % SPECIALS.length;
      this.special = SPECIALS[this.currentIndex];
            if (this.slideIndex < this.slides.length) {
        this.slideIndex++;
      } else {
        this.slideIndex = 1; // Loop back to the first slide
      }
    },
    prevAnimal() {
      this.currentIndex = (this.currentIndex - 1 + SPECIALS.length) % SPECIALS.length;
      this.special = SPECIALS[this.currentIndex];
      if (this.slideIndex > 1) {
        this.slideIndex--;
      } else {
        this.slideIndex = this.slides.length; // Loop back to the last slide
      }
    },

    changeSlide(n) {
      this.slideIndex += n;
      if (this.slideIndex > this.slides.length) {
        this.slideIndex = 1;
      }
      if (this.slideIndex < 1) {
        this.slideIndex = this.slides.length;
      }
    },
    goToSlide(n) {
      this.slideIndex = n;
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
      this.applyDarkMode();
    },
    applyDarkMode() {
      if (this.darkMode) {
        document.documentElement.classList.add('dark-mode'); // Add dark-mode class to the root HTML element
      } else {
        document.documentElement.classList.remove('dark-mode'); // Remove dark-mode class from the root HTML element
      }
      if (this.darkMode) {
        document.querySelector('.SMPage').classList.add('dark-background'); // Add dark-background class
        sMTheme = 'dark';
      } else {
        document.querySelector('.SMPage').classList.remove('dark-background'); // Remove dark-background class
        sMTheme = 'light';
      }
      // Remove the existing Twitter container element
      const tweetContainer = document.getElementById('tweetContainer');
      tweetContainer.innerHTML = '';
      // Embed the tweet again with the updated theme
      embedTweet();
    },
    mounted() {
      setInterval(() => {
        this.changeSlide(1);
      }, 3000); // Change slide every 3 seconds
    },
  },
  mounted() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      this.darkMode = JSON.parse(savedDarkMode);
      this.applyDarkMode();
    }

  }

});



document.addEventListener("DOMContentLoaded", function() {

  // Call the function to embed the Instagram post
  embedInstagramPost('igContainer1', intgPNum1);
  embedInstagramPost('igContainer2', intgPNum2);

  if (!window.twttr || !window.twttr.ready) {

    // If twttr is not ready, retry after a short delay
    let attempt = 0;
    const maxAttempts = 10;
    const retryInterval = 500; // 500 milliseconds

    checkTwttrReady(attempt, maxAttempts, retryInterval);
  }

});

document.addEventListener('DOMContentLoaded', function() {
  const popZone = document.querySelector('.popZone');
  const heroSection = document.querySelector('.popUpContainer.bottomSection');

  popZone.addEventListener('mouseover', function() {
    heroSection.style.backgroundImage = "url('../assets/images/heroImage/Hero_popKoala.jpg')";
  });

  popZone.addEventListener('mouseout', function() {
    heroSection.style.backgroundImage = "url('../assets/images/heroImage/Hero_Koala.jpg')";
  });
});

// Ensure the DOM is fully loaded before attaching the event listener
document.addEventListener('DOMContentLoaded', function () {

  // Attach the event listener to the button
  const instaPostButton1 = document.getElementById('instaPostButton1');
  const instaPostButton2 = document.getElementById('instaPostButton2');
  if (instaPostButton1) {
    instaPostButton1.addEventListener('click', openInstaPost1);
  } else {
    console.error('Instagram post button not found.');
  }
  if (instaPostButton2) {
    instaPostButton2.addEventListener('click', openInstaPost2);
  } else {
    console.error('Instagram post button not found.');
  }



  // The rest of your existing DOMContentLoaded logic here...
  const updateForm = document.getElementById('updateForm');

  if (updateForm) {
    updateForm.addEventListener('submit', function (event) {
      event.preventDefault();

      // Get the input values
      const twitterID = document.getElementById('twitterP').value;
      const instaID1 = document.getElementById('instagramP1').value;
      const instaID2 = document.getElementById('instagramP2').value;

      // Update the social media variables
      updateSocialMediaVariables(twitterID, instaID1, instaID2);

    });
  } else {
    console.error('Update form not found.');
  }
});



$(window).on('scroll', function() {
  if ($(window).scrollTop() > $('.bottomSection').offset().top ) {
    $('html').addClass('no-scroll-snap');
  } else {
    $('html').removeClass('no-scroll-snap');
  }
});


