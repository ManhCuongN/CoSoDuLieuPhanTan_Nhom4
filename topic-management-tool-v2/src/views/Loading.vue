<template>
  <div class="page-content page-container" id="page-content">
    <div class="padding">
      <div class="row container d-flex justify-content-center">
        <div class="col-md-4 col-sm-6 grid-margin stretch-card">
          <div class="loader-demo-box text-center">
            <div class="jumping-dots-loader">
              <span></span> <span></span> <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingView",
};
</script>

<style scoped>
.flex {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
}

@media (max-width: 991.98px) {
  .padding {
    padding: 1.5rem;
  }
}

@media (max-width: 767.98px) {
  .padding {
    padding: 1rem;
  }
}

.padding {
  padding: 5rem;
}

.card {
  box-shadow: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  -ms-box-shadow: none;
}

.border-secondary,
.loader-demo-box {
  border-color: #a3a4a5 !important;
}

.rounded,
.loader-demo-box {
  border-radius: 0.25rem !important;
}

.loader-demo-box {
  width: 100%;
  height: 200px;
}

.jumping-dots-loader {
  width: 100px;
  height: 100px;
  border-radius: 100%;
  position: relative;
  margin: 0 auto;
}

.jumping-dots-loader span {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: rgba(241, 83, 110, 0.8);
  margin: 35px 5px;
}

.jumping-dots-loader span:nth-child(1) {
  animation: bounce 1s ease-in-out infinite;
}

.jumping-dots-loader span:nth-child(2) {
  animation: bounce 1s ease-in-out 0.33s infinite;
}

.jumping-dots-loader span:nth-child(3) {
  animation: bounce 1s ease-in-out 0.66s infinite;
}

@keyframes bounce {
  0%,
  75%,
  100% {
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    -o-transform: translateY(0);
    transform: translateY(0);
  }

  25% {
    -webkit-transform: translateY(-20px);
    -ms-transform: translateY(-20px);
    -o-transform: translateY(-20px);
    transform: translateY(-20px);
  }
}
</style>