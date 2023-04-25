<template>
  <div class="container-fluid">
    <div
      class="page-header min-height-300 border-radius-xl mt-4"
      style="
        background-image: url('https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80');
      "
    >
      <span class="mask bg-gradient-success opacity-6"></span>
    </div>
    <div class="card card-body mx-3 mx-md-4 mt-n6">
      <div class="row gx-4">
        <div class="col-auto">
          <div class="avatar avatar-xl position-relative">
            <img
              referrerpolicy="no-referrer"
              :src="user.picture"
              alt="profile_image"
              class="shadow-sm w-100 border-radius-lg"
            />
          </div>
        </div>
        <div class="col-auto my-auto">
          <div class="h-100">
            <div class="d-flex justify-content-between">
              <h5 class="mb-1">{{ user.displayName }}</h5>
              <div class="text-end ps-3" v-if="!preview">
                <a class="hover" @click="isEditing = !isEditing">
                  <i
                    class="text-sm fas fa-user-edit text-secondary"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Chỉnh sửa thông tin"
                  ></i>
                </a>
              </div>
            </div>
            <p class="mb-0 font-weight-normal text-sm">{{ user.email }}</p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="mt-3 row">
          <profile-info-card :user="user" v-if="isEditing == false" />
          <input-profile-card :user="user" v-else @update:user="updateUser" />
        </div>
        <hr class="my-4 horizontal dark" />
        <div class="row mt-4">
          <div class="col-12">
            <div class="mb-5 ps-3">
              <h6 class="mb-1">Kinh nghiệm</h6>
              <p class="text-sm">Các đề tài đã tham gia</p>
            </div>
            <div class="row">
              <default-project-card
                title="Modern"
                :image="topic"
                label="Project #2"
                description="As Uber works through a huge amount of internal
                management turmoil."
                :authors="[
                  {
                    image: team1,
                    name: 'Elena Morison',
                  },
                  {
                    image: team2,
                    name: 'Ryan Milly',
                  },
                  {
                    image: team3,
                    name: 'Nick Daniel',
                  },
                  {
                    image: team4,
                    name: 'Peterson',
                  },
                ]"
                :action="{
                  color: 'success',
                  label: 'View Project',
                }"
              />

              <default-project-card
                title="Scandinavian"
                :image="img2"
                label="Project #1"
                description="Music is something that every person has his or her own
                      specific opinion about."
                :authors="[
                  {
                    image: team3,
                    name: 'Nick Daniel',
                  },
                  {
                    image: team4,
                    name: 'Peterson',
                  },
                  {
                    image: team1,
                    name: 'Elena Morison',
                  },
                  {
                    image: team2,
                    name: 'Ryan Milly',
                  },
                ]"
                :action="{
                  color: 'success',
                  label: 'View Project',
                }"
              />

              <default-project-card
                title="Minimalist"
                :image="img3"
                label="Project #3"
                description="Different people have different taste, and various types
                      of music."
                :authors="[
                  {
                    image: team4,
                    name: 'Peterson',
                  },
                  {
                    image: team3,
                    name: 'Nick Daniel',
                  },
                  {
                    image: team1,
                    name: 'Elena Morison',
                  },
                  {
                    image: team2,
                    name: 'Ryan Milly',
                  },
                ]"
                :action="{
                  color: 'success',
                  label: 'View Project',
                }"
              />
              <default-project-card
                title="Gothic"
                image="https://images.unsplash.com/photo-1606744824163-985d376605aa?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                label="Project #4"
                description="Why would anyone pick blue over pink? Pink is obviously a
                      better color."
                :authors="[
                  {
                    image: team4,
                    name: 'Peterson',
                  },
                  {
                    image: team3,
                    name: 'Nick Daniel',
                  },
                  {
                    image: team2,
                    name: 'Ryan Milly',
                  },
                  {
                    image: team1,
                    name: 'Elena Morison',
                  },
                ]"
                :action="{
                  color: 'success',
                  label: 'View Project',
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileInfoCard from "./components/ProfileInfoCard.vue";
import InputProfileCard from "./components/InputProfileCard.vue";
import DefaultProjectCard from "./components/DefaultProjectCard.vue";
import marie from "@/assets/img/marie.jpg";
import ivana from "@/assets/img/ivana-square.jpg";
import peterson from "@/assets/img/team-4.jpg";
import nick from "@/assets/img/team-3.jpg";
import img1 from "@/assets/img/home-decor-1.jpg";
import img2 from "@/assets/img/home-decor-2.jpg";
import img3 from "@/assets/img/home-decor-3.jpg";
import team1 from "@/assets/img/team-1.jpg";
import team2 from "@/assets/img/team-2.jpg";
import team3 from "@/assets/img/team-3.jpg";
import team4 from "@/assets/img/team-4.jpg";
import topic from "@/assets/img/topic.jpg";

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import userService from "../api/user";
export default {
  name: "profile-overview",
  inject: ["authData"],
  data() {
    return {
      user: {},
      isEditing: false,
      preview: false,
      showMenu: false,
      marie,
      ivana,
      peterson,
      topic,
      nick,
      img1,
      team1,
      team2,
      team3,
      team4,
      img2,
      img3,
    };
  },
  components: {
    ProfileInfoCard,
    DefaultProjectCard,
    InputProfileCard,
  },
  async created() {
    const { idUser } = this.$route.params;

    if (!idUser) {
      this.user = this.authData.state.user;
      this.preview = false;
    } else {
      const user = await userService.get({ _id: idUser });
      this.user = user.data[0];
      this.preview = true;
    }
  },
  methods: {
    updateUser() {
      this.isEditing = false;
      this.user = this.authData.state.user;
    },
  },
  mounted() {
    this.$store.state.isAbsolute = true;
    setNavPills();
    setTooltip();
  },
  beforeUnmount() {
    this.$store.state.isAbsolute = false;
  },
};
</script>
