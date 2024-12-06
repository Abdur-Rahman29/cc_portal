// Copyright 2017-2019 LinkedIn Corp. Licensed under the BSD 2-Clause License (the "License"). See License in the project root for license information.

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    chartColors: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
    configurl: './static/config.csv', // path to the cruise-control REST end-points
    config: {}, // remote cc urls information
    configError: null, // true if we have problem loading configuration
    configErrorMessage: null, // Actual configuration loading-error message
    url: null, // origin of the current CC we are dealing with
    online: true,
    autoReloadEnabled: false, // disabled by default
    autoReloadInterval: 30000, // 30 seconds
    isAuthenticated: false,
    userRole: localStorage.getItem('userRole') || null, // Retrieve user role from localStorage
    // these control the enablement of a module in cruise control
    modules: {
      chart_page: true,
      state: true,
      kafkaclusterstate: true,
      load: true,
      // replicaload: false, This has been removed from backend code
      partitionload: true,
      proposals: true,
      user_tasks: true,
      // admin_state: true,
      admin_broker: true,
      // peer reviews module
      review: true
    },
    hideHelperURL: true,
    showFullStackTrace: false,
    // config.csv reload control variables
    enableConfigFileReload: false,
    configFileReloadInterval: 50000, // in milli seconds
    // user-task-id features
    userTasks: {
      // url: uuid (is the structure for this)
    }
  },
  getters: {
    geturl: function (state) {
      return state.url
    },
    getnewurl: function (state, getters) {
      return function (group, label) {
        return state.config[group][label]
      }
    },
    getTaskId: function (state, getters) {
      return function (url) {
        return state.userTasks[url]
      }
    },
    isAuthenticated: state => state.isAuthenticated,
    userRole: state => state.userRole
  },
  actions: {
    login ({ commit }, { status, role }) {
      console.log('Triggering login action')
      // const user = state.users[username];
      commit('SET_AUTHENTICATION', { status, role })
    },
    logout ({ commit }, status) {
      console.log('Triggering logout action')
      commit('SET_AUTHENTICATION', { status, role: 'null' })
    }
  },
  mutations: {
    seturl: function (state, url) {
      console.log(state)
      console.log(url)
      state.url = url
    },
    setonline: function (state, online) {
      state.online = online
    },
    config: function (state, newconfig) {
      state.config = newconfig
    },
    configError: function (state, val) {
      state.configError = val
    },
    configErrorMessage: function (state, val) {
      state.configErrorMessage = val
    },
    setTaskId: function (state, params) {
      if (params.taskid) {
        // set if the taskid is valid
        Vue.set(state.userTasks, params.url, params.taskid)
      } else {
        // delete if the taskid is invalid
        Vue.delete(state.userTasks, params.url)
      }
    },
    SET_AUTHENTICATION (state, { status, role }) {
      state.isAuthenticated = status
      state.userRole = role
      console.log('before setting user role', role)
      localStorage.setItem('requiresAuth', status ? 'true' : 'false')
      localStorage.setItem('isAuthenticated', status) // Use 'false' for logout
      localStorage.setItem('userRole', role) // Store the role
    }
  }
})
