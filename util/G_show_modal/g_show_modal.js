import sj_show_modal from './index.js'
const g_show_modal = {
	install: function(Vue) {
      Vue.prototype.$showModal=function(op={}){
		 return	new Promise((resolve, reject)=>{
			   let ssm=new sj_show_modal({
					...op,
					$event:function(e){
						if(e.res){
							resolve(e);
						}else{
							reject(e);
						}
					 }
					})
					ssm.show();
					Vue.prototype.$hide=function(){
						ssm.hide();
					}
			})
		}
	}
};

export default g_show_modal
