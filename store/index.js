import Vue from 'vue';
import Vuex from 'vuex';

import file from './modules/file.js'
import views from './modules/views.js'

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		file,
		views
	}
});
