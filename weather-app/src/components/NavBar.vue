<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Weather App</a>
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <div class="w-100 d-flex justify-content-center my-2">
                    <div class="search-container">
                    <input
                        ref="searchInput"
                        type="text"
                        class="form-control search-input"
                        placeholder="Recherchez une ville"
                        v-model="searchQuery"
                        @focus="animateFocus"
                        @blur="animateBlur"
                        @keyup.enter="submitSearch"
                    />
                    <i class="fas fa-search search-icon" @click="submitSearch"></i>
                    </div>
                </div>
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link portfolio-link" href="https://alexportfolio.com" target="_blank">Mon Portfolio</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
    import { gsap } from "gsap";

    export default {
        name: "NavBar",
        data() {
            return {
            searchQuery: ""
            };
        },
        methods: {
            submitSearch() {
            if (this.searchQuery.trim()) {
                this.$emit("search-city", this.searchQuery);
                this.searchQuery = "";
            }
            },
            animateFocus() {
            gsap.to(this.$refs.searchInput, {
                duration: 0.3,
                boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
                scale: 1.02
            });
            gsap.to(".search-icon", {
                duration: 0.3,
                color: "#fff",
                scale: 1.2
            });
            },
            animateBlur() {
            gsap.to(this.$refs.searchInput, {
                duration: 0.3,
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                scale: 1
            });
            gsap.to(".search-icon", {
                duration: 0.3,
                color: "#888",
                scale: 1
            });
            }
        }
    };
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');

    .navbar {
        background-color: #333;
        padding: 20px;
    }

    .navbar-brand {
        font-size: 24px;
        font-family: 'Lobster', cursive;
    }

    .search-container {
        position: relative;
        width: 400px;
    }

    .search-input {
        height: 50px;
        border-radius: 30px;
        padding-left: 50px;
        border: none;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    }

    .search-icon {
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translateY(-50%);
        color: #888;
        cursor: pointer;
        transition: color 0.3s ease, transform 0.3s ease;
    }

    .navbar-nav {
        margin: 0;
    }

    .nav-link {
        color: #fff;
        font-weight: 500;
        transition: color 0.3s ease;
    }

    .nav-link:hover {
        color: #f39c12;
    }

    .portfolio-link {
        font-size: 1.2rem;
    }

    @media (max-width: 576px) {
        .search-container {
            width: 100%;
            margin-bottom: 10px;
        }
    }
</style>
  