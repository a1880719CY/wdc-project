// header.js
export default {
    name: 'header',
    template: `
    <header>
    <nav class="menu-bar">
      <div class="logo">{{ logoText }}</div>
      <ul>
        <li
          v-for="item in menuItems"
          :key="item.text"
          :class="{ 'signup-login': item.alignRight }"
          @click="handlerClick(item.text)"
        >
          <a :href="item.link" @click="handlerOut(item.text)">{{ item.text }}</a>
        </li>
      </ul>
    </nav>
  </header>
    `,
    data() {
      return {
        logoText: 'Endangered Animals Organization',
        userInfo:{},
        menuItems: [
        { text: 'Home', link: '/index.html' },
        { text: 'Volunteer Org', link: '/volunteerOrg.html' },
        { text: 'Personal Center', link: '/personalCenter.html' },
        { text: 'Our Mission', link: '/ourMission.html' },
        { text: 'Social Media', link: '/socialMedia.html' },
        { text: 'Sign Up/Log In', link: '/login.html', alignRight: true },
        ],
      }
    },
    mounted(){
      this.userInfo=JSON.parse(localStorage.getItem('userInfo'))
      this.handlerClick()
    },
    methods:{
      handlerClick(){
        if(this.userInfo){
          this.menuItems[6].text='Log out'
          this.menuItems[6].link='#'

        }

      },
      handlerOut(text){
        if(text=='Log out'){
          localStorage.removeItem("token")
          localStorage.removeItem("userInfo")
          localStorage.removeItem("role")
          window.location.href = 'login.html';
        }

      }
    },
  }