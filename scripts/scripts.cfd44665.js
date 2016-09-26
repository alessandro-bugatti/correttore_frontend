"use strict";angular.module("frontendStableApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngMaterial","ngFileUpload"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/teachers/:teacherId?",{templateUrl:"views/teachers.html",controller:"TeachersCtrl"}).when("/groups/:groupId?",{templateUrl:"views/groups.html",controller:"GroupsCtrl"}).when("/tasks/:taskId?",{templateUrl:"views/tasks.html",controller:"TasksCtrl"}).when("/problems/:problemId?",{templateUrl:"views/problems.html",controller:"ProblemsCtrl"}).otherwise({redirectTo:"/"})}]).config(["$mdThemingProvider",function(a){a.theme("guest").primaryPalette("light-green").accentPalette("deep-orange").warnPalette("pink").dark(),a.theme("student").primaryPalette("amber").accentPalette("cyan").warnPalette("pink").dark(),a.theme("teacher").primaryPalette("blue").accentPalette("deep-orange").warnPalette("amber"),a.theme("admin").primaryPalette("green").accentPalette("indigo").warnPalette("amber"),a.setDefaultTheme("guest"),a.alwaysWatchTheme(!0)}]).config(["ConfigProvider",function(a){a.serverVersion="v1",a.serverHost="https://auth-silex-test-alessandro-bugatti.c9users.io",a.authTokenName="x-authorization-token"}]),angular.module("frontendStableApp").provider("Config",function(){this.serverVersion=null,this.serverHost=null,this.authTokenName=null,this.clientVersion="0.1.4";var a="Uninitialized config server values";this.$get=function(){var b=this;return{getServerPath:function(){if(!b.serverHost||!b.serverVersion)throw a;return b.serverHost+"/"+b.serverVersion+"/"},getAuthTokenName:function(){if(!b.authTokenName)throw a;return b.authTokenName},getVersion:function(){return b.clientVersion}}}}),angular.module("frontendStableApp").directive("fileModel",["$parse",function(a){return{restrict:"A",link:function(b,c,d){var e=a(d.fileModel),f=e.assign;c.bind("change",function(){b.$apply(function(){f(b,c[0].files[0])})})}}}]),angular.module("frontendStableApp").controller("MainCtrl",["AuthService","$location",function(a,b){a.isLogged()||b.path("/login")}]),angular.module("frontendStableApp").controller("SidenavCtrl",["$scope","$mdMedia","$mdDialog","$mdSidenav","$location","Config","$rootScope","AuthService",function(a,b,c,d,e,f,g,h){function i(d){var e=(b("sm")||b("xs"))&&a.customFullscreen;c.show({controller:"DialogCtrl",templateUrl:"views/about.html",parent:angular.element(document.body),targetEvent:d,clickOutsideToClose:!0,fullscreen:e,locals:{items:{clientVersion:f.getVersion(),rootScope:g}}}),a.$watch(function(){return b("xs")||b("sm")},function(b){a.customFullscreen=b===!0})}a.customFullscreen=b("xs")||b("sm"),a.authService=h,a.closed=!1,g.$on("sidenav-close",function(){a.closed=!0}),g.$on("sidenav-toggle",function(){a.closed=!a.closed}),g.$on("sidenav-open",function(){a.closed=!1}),a.menuEntries=[{title:"Docenti",description:"Gestisci i docenti",icon:"graduation-cap",allowed:"admin",link:"/teachers"},{title:"Gruppi",description:"Gestisci i gruppi",icon:"users",allowed:["admin","teacher"],link:"/groups"},{title:"Problemi",description:"Gestisci i problemi",icon:"tasks",allowed:["admin","teacher"],link:"/tasks"},{title:"Esercizi",description:"Sottometti una soluzione",icon:"code",allowed:"*",link:"/problems"},{title:"Disconnetti",description:"Esegui il logout",icon:"sign-out",allowed:"*",callback:function(a,b){h.isLogged()?h.logout().then(function(){e.path("/login")}):e.path("/login")}},{title:"Informazioni",description:"Informazioni sul correttore",icon:"info-circle",allowed:"*",callback:function(a,b){i(b)}}],a.handleClick=function(b,c){b.link?a.goTo(b.link):"function"==typeof b.callback&&b.callback(b,c),d("left").close()},a.display=function(a){if(a.allowed){if("object"!=typeof a.allowed){if("*"==a.allowed)return!0;a.allowed=[a.allowed]}}else a.allowed=[];if(a.forbidden){if("object"!=typeof a.forbidden){if("*"==a.forbidden)return!1;a.forbidden=[a.forbidden]}}else a.forbidden=[];return h.allowedForbidden(a.allowed,a.forbidden)},a.goTo=function(a){e.path(a)}}]),angular.module("frontendStableApp").controller("ToolbarCtrl",["$scope","$mdSidenav","$rootScope","$window",function(a,b,c,d){a.openSidenav=function(){b("left").open()},a.hide=!1,a.loading=!1,c.$on("toolbar-hide",function(){a.hide=!0}),c.$on("toolbar-toggle",function(){a.hide=!a.hide}),c.$on("toolbar-show",function(){a.hide=!1}),c.$on("loading-start",function(){a.loading=!0}),c.$on("loading-stop",function(){a.loading=!1}),c.$on("loading-toggle",function(){a.loading=!a.loading}),a.showBack=!1,a.goBack=function(){a.showBack=!1,d.history.back()},c.$on("has-back",function(){a.showBack=!0})}]),angular.module("frontendStableApp").controller("DialogCtrl",["$scope","$mdDialog","items",function(a,b,c){a.close=function(){b.cancel()};for(var d in c)c.hasOwnProperty(d)&&(a[d]=c[d])}]),angular.module("frontendStableApp").controller("LoginCtrl",["AuthService","$scope","$location","$rootScope","$mdSidenav","$mdTheming",function(a,b,c,d,e,f){function g(){d.$emit("sidenav-open"),d.$emit("toolbar-show"),f.THEMES.hasOwnProperty(a.getLoginResponse().role)&&(d.theme=a.getLoginResponse().role),c.search().redirect?(c.path(c.search().redirect),c.search({})):c.path("/")}return a.isLogged()?void g():(e("left").close(),d.$emit("sidenav-close"),d.$emit("toolbar-hide"),b.user={username:"",password:""},b.loading=!1,b.loginForm=!0,b.loadingMessage="Accesso in corso...",b.errorMessage=null,b.loading||(d.theme="guest"),a.hasAuthToken()&&(b.loadingMessage="Ripresa della sessione...",b.loginForm=!1,b.loading=!0,a.getSessionInfo().then(function(){g()},function(){b.errorMessage="La sessione è scaduta. Accedi per continuare",b.loadingMessage="Accesso in corso...",b.loading=!1,b.loginForm=!0})),b.login=function(){b.errorMessage=null,b.loading=!0,a.login(b.user.username,b.user.password).then(function(){g()},function(){b.loading=!1,b.errorMessage="Credenziali non valide"})},void(b.guestLogin=function(){d.$emit("sidenav-open"),d.$emit("toolbar-show"),a.guestLogin(),c.path("/problems"),c.search({})}))}]),angular.module("frontendStableApp").controller("TeachersCtrl",["AuthService","TeachersService","$scope","$location","$routeParams","$log","$rootScope",function(a,b,c,d,e,f,g){return a.isLogged()?a.atLeast("admin")?(c.$location=d,c.deleteTeacher=function(a,d,e){g.$emit("loading-start"),c.teachers.splice(d,1),b.deleteTeacher(a).then(function(){g.$emit("loading-stop")})},c.loading=!0,g.$emit("loading-start"),c.teacherId=null,e.teacherId?(c.teacherId=e.teacherId,c.user={name:"",surname:"",username:"",password:"",password2:""},"new"==c.teacherId?(c.loading=!1,g.$emit("loading-stop")):b.getOneTeacher(c.teacherId).then(function(a){c.loading=!1,g.$emit("loading-stop"),c.user=a}),c.save=function(){g.$emit("loading-start"),"new"==c.teacherId?b.addTeacher(c.user.name,c.user.surname,c.user.username,c.user.password).then(function(a){g.$emit("loading-stop"),d.path("/teachers")}):b.updateTeacher(c.teacherId,c.user.name,c.user.surname,c.user.username,c.user.password).then(function(a){g.$emit("loading-stop"),d.path("/teachers")})}):(c.teachers=[],b.getList().then(function(a){c.loading=!1,g.$emit("loading-stop"),c.teachers=a})),void(c.openTeacher=function(a){g.$emit("has-back"),d.path("/teachers/"+a)})):(d.path("/"),void d.search({})):(d.search({redirect:d.path()}),void d.path("/login"))}]),angular.module("frontendStableApp").controller("GroupsCtrl",["AuthService","GroupsService","$scope","$location","$routeParams","$log","$rootScope",function(a,b,c,d,e,f,g){if(!a.isLogged())return d.search({redirect:d.path()}),void d.path("/login");if(!a.atLeast("teacher"))return d.path("/"),void d.search({});if(c.$location=d,c.isTeacherOnly=a.allowedForbidden("teacher","admin"),c.deleteGroup=function(a,d){return c.isTeacherOnly?(g.$emit("loading-start"),c.groups.splice(d,1),void b.deleteGroup(a).then(function(){g.$emit("loading-stop")})):!1},c.loading=!0,g.$emit("loading-start"),c.groupId=null,e.groupId){if(!c.isTeacherOnly)return d.path("/groups"),!1;c.groupId=e.groupId,c.group={description:""},"new"==c.groupId?(c.loading=!1,g.$emit("loading-stop")):b.getList().then(function(a){for(var b=0;b<a.length;b++)a[b].id==c.groupId&&(c.group=a[b]);c.group.description||d.path("/groups"),c.loading=!1,g.$emit("loading-stop")}),c.save=function(){g.$emit("loading-start"),"new"==c.groupId?b.addGroup(c.group.description).then(function(a){g.$emit("loading-stop"),d.path("/groups")}):b.updateGroup(c.groupId,c.group.description).then(function(a){g.$emit("loading-stop"),d.path("/groups")})}}else c.groups=[],b.getList().then(function(a){c.loading=!1,g.$emit("loading-stop"),c.groups=a});c.openGroup=function(a){g.$emit("has-back"),d.path("/groups/"+a)}}]),angular.module("frontendStableApp").controller("TasksCtrl",["AuthService","TasksService","$scope","$location","$routeParams","$log","$rootScope","$mdMedia","$mdTheming",function(a,b,c,d,e,f,g,h,i){if(!a.isLogged())return d.search({redirect:d.path()}),void d.path("/login");if(g.theme||(g.theme=i.defaultTheme()),c.currentThemeObj=i.THEMES[g.theme],c.mdMedia=h,c.categorie=[{id:1,name:"Sequenza"},{id:2,name:"Selezione"},{id:3,name:"Input/Output"}],!a.atLeast("teacher"))return d.path("/"),void d.search({});if(c.$location=d,c.isTeacherOnly=a.allowedForbidden("teacher","admin"),c.deleteTask=function(a,d){return c.isTeacherOnly?(g.$emit("loading-start"),c.tasks.splice(d,1),void b.deleteTask(a).then(function(){g.$emit("loading-stop")})):!1},c.loading=!0,g.$emit("loading-start"),c.taskId=null,e.taskId){if(c.taskId=e.taskId,"new"==c.taskId&&!c.isTeacherOnly)return d.path("/tasks"),!1;c.task={title:"",short_title:"",is_public:"0",level:1,test_cases:1,category_id:0,description:null,solution:null,material:null},c.setFile=function(a,b){c.task[a]=b[0]},"new"==c.taskId?(c.loading=!1,g.$emit("loading-stop")):b.getOneTask(c.taskId).then(function(a){c.task=JSON.parse(JSON.stringify(a)),c.loading=!1,g.$emit("loading-stop"),c.task.test_cases=parseInt(c.task.test_cases)},function(a){d.path("/tasks")}),c.save=function(){g.$emit("loading-start"),"new"==c.taskId?b.addTask(c.task).then(function(a){g.$emit("loading-stop"),d.path("/tasks")}):(g.$emit("loading-start"),b.updateTask(c.taskId,c.task).then(function(a){g.$emit("loading-stop")}))}}else c.tasks=[],b.getList().then(function(a){c.loading=!1,g.$emit("loading-stop"),c.tasks=a});c.openTask=function(a){g.$emit("has-back"),d.path("/tasks/"+a)}}]),angular.module("frontendStableApp").controller("ProblemsCtrl",["AuthService","ProblemsService","$scope","$location","$routeParams","$log","$rootScope","$mdMedia","$mdTheming",function(a,b,c,d,e,f,g,h,i){return!a.isLogged()&&a.getAuthToken()||!a.getLoginResponse().username?(d.search({redirect:d.path()}),void d.path("/login")):(g.theme||(g.theme=i.defaultTheme()),c.currentThemeObj=i.THEMES[g.theme],c.mdMedia=h,c.$location=d,c.loading=!0,c.pdfLoading=!0,g.$emit("loading-start"),c.problemId=null,e.problemId?(c.problemId=e.problemId,c.problem={title:"",short_title:"",level:0,pdf:null,sourceFile:null},c.setFile=function(a,b){c.problem[a]=b[0]},b.getOneProblem(c.problemId).then(function(a){return c.problem=a,c.loading=!1,g.$emit("loading-stop"),b.getPDF(c.problemId)},function(a){d.path("/problems")}).then(function(a){c.problem.pdf=a,c.pdfLoading=!1},function(a){c.pdfLoading=!1,f.error(a)})):(c.problems=[],b.getList().then(function(a){c.loading=!1,g.$emit("loading-stop"),c.problems=a})),void(c.openProblem=function(a){g.$emit("has-back"),d.path("/problems/"+a)}))}]),angular.module("frontendStableApp").service("ResourcesGeneratorService",["Config","$resource","$q",function(a,b,c){this.getResource=function(c,d){var e={};return e[a.getAuthTokenName()]=c,c?b(a.getServerPath()+d,{},{get:{method:"GET",headers:e},save:{method:"POST",headers:e},post:{method:"POST",headers:e},put:{method:"PUT",headers:e,params:{studentId:"@studentId",groupId:"@groupId"}},query:{method:"GET",isArray:!0,headers:e},remove:{method:"DELETE",headers:e},"delete":{method:"DELETE",headers:e}}):b(a.getServerPath()+"public/"+d)},this.successHandler=function(a){return a},this.failureHandler=function(a){return a&&a.data&&void 0!=a.data.error?c.reject(a.data.error):c.reject(a.data)}}]),angular.module("frontendStableApp").service("AuthService",["ResourcesGeneratorService","$q","$window",function(a,b,c){function d(a){switch(g=0,a){case"admin":g+=i.roleValues.admin;case"teacher":g+=i.roleValues.teacher;case"student":g+=i.roleValues.student}}var e=c.localStorage.getItem("authToken"),f=!1,g=0,h={},i=this;this.roleValues={admin:4,teacher:2,student:1},this.getLoginResponse=function(){return h},this.getRolesArray=function(){var a=[];for(var b in this.roleValues)this.roleValues.hasOwnProperty(b)&&g&this.roleValues[b]&&a.push(b);return a},this.allowedForbidden=function(a,b){"object"!=typeof a&&(a=[a]),"object"!=typeof b&&(b=[b]);for(var c=0,d=0;d<a.length;d++)i.roleValues.hasOwnProperty(a[d])&&(c+=i.roleValues[a[d]]);var e=0;for(d=0;d<b.length;d++)i.roleValues.hasOwnProperty(b[d])&&(e+=i.roleValues[b[d]]);return 0==(g&e)&&(g&c)>0},this.checkRole=function(a){if(!i.roleValues[a])throw"Invalid role name";return(i.roleValues[a]&g)>0},this.atLeast=function(a){if(!i.roleValues[a])throw"Invalid role name";return g>=i.roleValues[a]},this.getRoleValue=function(){return g},this.isLogged=function(){return f},this.getAuthToken=function(){return e},this.hasAuthToken=function(){return void 0!=e&&null!=e},this.login=function(g,i){return a.getResource(null,"login").save({username:g,password:i}).$promise.then(function(a){return c.localStorage.setItem("authToken",a.token),e=a.token,f=!0,h=a,d(a.role),a},function(a){return c.localStorage.removeItem("authToken"),e=null,f=!1,b.reject(a.data)})},this.guestLogin=function(){h={username:"ospite"}},this.logout=function(){return e&&f?a.getResource(e,"logout").get().$promise.then(function(a){return c.localStorage.removeItem("authToken"),e=null,f=!1,g=0,h=null,a},function(a){return b.reject(a.data)}):b.reject("null authToken")},this.getSessionInfo=function(){return e?a.getResource(e,"info").get().$promise.then(function(a){return f=!0,h=a,d(a.role),a},function(a){return f=!1,b.reject(a.data)}):b.reject("null authToken")}}]),angular.module("frontendStableApp").service("TeachersService",["ResourcesGeneratorService","AuthService","$q",function(a,b,c){this.getList=function(){return b.isLogged&&b.atLeast("admin")?a.getResource(b.getAuthToken(),"teachers").query().$promise.then(a.successHandler,a.failureHandler):c.reject("User not logged in")},this.getOneTeacher=function(d){return b.isLogged&&b.atLeast("admin")?a.getResource(b.getAuthToken(),"teachers/:id").get({id:d}).$promise.then(a.successHandler,a.failureHandler):c.reject("User not logged in")},this.addTeacher=function(d,e,f,g){return b.isLogged&&b.atLeast("admin")?a.getResource(b.getAuthToken(),"teachers/").post({name:d,surname:e,username:f,password:g,role:"teacher"}).$promise.then(a.successHandler,a.failureHandler):c.reject("User not logged in")},this.updateTeacher=function(d,e,f,g,h){return b.isLogged&&b.atLeast("admin")?a.getResource(b.getAuthToken(),"teachers/:id").put({id:d},{name:e,surname:f,username:g,password:h,role:"teacher"}).$promise.then(a.successHandler,a.failureHandler):c.reject("User not logged in")},this.deleteTeacher=function(d){return b.isLogged&&b.atLeast("admin")?a.getResource(b.getAuthToken(),"teachers/:id")["delete"]({id:d}).$promise.then(a.successHandler,a.failureHandler):c.reject("User not logged in")}}]),angular.module("frontendStableApp").service("TasksService",["ResourcesGeneratorService","Upload","Config","AuthService","$q",function(a,b,c,d,e){this.getList=function(){return d.isLogged&&d.atLeast("teacher")?a.getResource(d.getAuthToken(),"tasks").query().$promise.then(a.successHandler,a.failureHandler):e.reject("User not logged in")},this.getOneTask=function(b){return d.isLogged&&d.atLeast("student")?a.getResource(d.getAuthToken(),"tasks/:id").get({id:b}).$promise.then(a.successHandler,a.failureHandler):e.reject("User not logged in")},this.updateTask=function(f,g){if(!d.isLogged||!d.allowedForbidden("teacher","admin"))return e.reject("User not logged in");var h={};return h[c.getAuthTokenName()]=d.getAuthToken(),b.upload({url:c.getServerPath()+"tasks/"+f,headers:h,data:g}).then(a.successHandler,a.failureHandler,function(a){})},this.addTask=function(f){if(!d.isLogged||!d.allowedForbidden("teacher","admin"))return e.reject("User not logged in");var g={};return g[c.getAuthTokenName()]=d.getAuthToken(),b.upload({url:c.getServerPath()+"tasks",headers:g,data:f}).then(a.successHandler,a.failureHandler,function(a){})},this.deleteTask=function(b){return d.isLogged&&d.allowedForbidden("teacher","admin")?a.getResource(d.getAuthToken(),"tasks/:id")["delete"]({id:b}).$promise.then(a.successHandler,a.failureHandler):e.reject("User not logged in")}}]),angular.module("frontendStableApp").service("GroupsService",["ResourcesGeneratorService","AuthService","$q",function(a,b,c){this.getList=function(){return b.isLogged&&b.atLeast("teacher")?a.getResource(b.getAuthToken(),"groups").query().$promise.then(a.successHandler,a.failureHandler):c.reject("User not logged in")},this.addGroup=function(d){return b.isLogged&&b.allowedForbidden("teacher","admin")?a.getResource(b.getAuthToken(),"groups").post({description:d}).$promise.then(a.successHandler,a.failureHandler):c.reject("User not logged in")},this.updateGroup=function(d,e){return b.isLogged&&b.allowedForbidden("teacher","admin")?a.getResource(b.getAuthToken(),"groups/:id").put({id:d},{description:e}).$promise.then(a.successHandler,a.failureHandler):c.reject("User not logged in")},this.deleteGroup=function(d){return b.isLogged&&b.allowedForbidden("teacher","admin")?a.getResource(b.getAuthToken(),"groups/:id")["delete"]({id:d}).$promise.then(a.successHandler,a.failureHandler):c.reject("User not logged in")},this.assignStudentToGroup=function(d,e){return b.isLogged&&b.allowedForbidden("teacher","admin")?a.getResource(b.getAuthToken(),"groups/:groupId/student/:studentId").put({groupId:e,studentId:d}).$promise.then(a.successHandler,a.failureHandler):c.reject("User not logged in")},this.removeStudentFromGroup=function(d,e){return b.isLogged&&b.allowedForbidden("teacher","admin")?a.getResource(b.getAuthToken(),"groups/:groupId/student/:studentId")["delete"]({groupId:e,studentId:d}).$promise.then(a.successHandler,a.failureHandler):c.reject("User not logged in")}}]),angular.module("frontendStableApp").service("ProblemsService",["ResourcesGeneratorService","Upload","Config","AuthService","$sce","$http",function(a,b,c,d,e,f){this.getList=function(){return a.getResource(null,"problems").query().$promise.then(a.successHandler,a.failureHandler)},this.getOneProblem=function(b){return a.getResource(null,"problems/:id").get({id:b}).$promise.then(a.successHandler,a.failureHandler)},this.getPDF=function(b){return f.get(c.getServerPath()+"public/problems/"+b+".pdf",{responseType:"arraybuffer"}).then(function(a){var b=new Blob([a.data],{type:"application/pdf"}),c=URL.createObjectURL(b);return e.trustAsResourceUrl(c)},a.failureHandler)}}]),angular.module("frontendStableApp").filter("roleFormatter",function(){return function(a){if("string"==typeof a)switch(a){case"admin":return"Amministratore";case"teacher":return"Docente";case"student":return"Studente"}return""}}),angular.module("frontendStableApp").filter("fileSizeFormatter",function(){return function(a){return"number"==typeof a?1024>a?a+"B":1048576>a?(a/1024).toFixed(2)+"KB":(a/1048576).toFixed(2)+"MB":""}}),angular.module("frontendStableApp").run(["$templateCache",function(a){a.put("views/about.html",'<md-dialog aria-label="About Us" md-theme="{{rootScope.theme}}"> <form> <md-toolbar> <div class="md-toolbar-tools"> <h2>About Us</h2> <span flex></span> <md-button class="md-icon-button" ng-click="close()"> <md-icon md-font-icon="fa-close" style="font-size: 20px" class="fa" aria-label="Close dialog"></md-icon> </md-button> </div> </md-toolbar> <md-dialog-content> <div class="md-dialog-content"> <h2 style="margin-top: 0">Correttore</h2> <p> Questa parte è sicuramente da riscrivere, ho tolto almeno il vecchio testo di prova. </p> <h5>Versione: {{clientVersion}}</h5> </div> </md-dialog-content> </form> </md-dialog>'),a.put("views/groups.html",'<md-card layout-fill class="no-padding" ng-if="!groupId && !loading"> <md-button class="md-primary md-raised" ng-if="isTeacherOnly" ng-click="$location.path(\'/groups/new\')">Aggiungi Gruppo </md-button> <md-list class="no-padding"> <md-list-item class="md-2-line" ng-repeat="group in groups" ng-click="isTeacherOnly && openGroup(group.id)"> <md-icon md-font-icon="fa-users" class="fa" style="font-size: 38px"></md-icon> <div class="md-list-item-text"> <h3>{{group.description}}</h3> <p>TODO: numero di studenti</p> </div> <md-button ng-if="isTeacherOnly" class="md-secondary md-icon-button md-raised" ng-click="deleteGroup(group.id, $index, $event)" aria-label="call"> <md-icon md-font-icon="fa-trash" class="fa" style="font-size: 25px"></md-icon> </md-button> </md-list-item> </md-list> </md-card> <md-card layout-padding ng-if="groupId && !loading"> <h2>{{groupId == \'new\' ? \'Aggiungi\' : \'Modifica\'}} Gruppo</h2> <md-content style="background-color: white"> <div> <form name="groupForm"> <div layout-gt-sm="row"> <md-input-container class="md-block" flex-gt-sm> <label>Descrizione</label> <input ng-model="group.description" required> </md-input-container> </div> </form> </div> </md-content> <md-content layout="row" layout-align="end center" style="background-color: white"> <md-button class="md-primary md-raised" ng-disabled="groupForm.$invalid" ng-click="save()">Salva </md-button> </md-content> </md-card>'),a.put("views/login.html",'<md-content class="md-padding" layout-xs="column" layout="row" layout-align="center center"> <div flex-xs flex-gt-xs="50" flex-gt-md="30" layout="column"> <md-card style="margin-top: 25%"> <img ng-src="images/login-card.2b0f315a.png" class="md-card-image" alt="Login"> <md-content layout-padding class="login-container" style="position: relative"> <div ng-show="loading" layout="column" layout-align="center center" style="margin-top: 10px"> <md-progress-circular md-mode="indeterminate"></md-progress-circular> <h2>{{loadingMessage}}</h2> </div> <div ng-show="loginForm && !loading"> <h4 style="margin: 0" ng-if="errorMessage">{{errorMessage}}</h4> <form name="LoginForm"> <div layout="column"> <md-input-container> <label>Nome utente</label> <input ng-model="user.username" ng-disabled="loading" ng-keypress="!LoginForm.$invalid && $event.keyCode == 13 && login()" required> </md-input-container> <md-input-container> <label>Password</label> <input ng-model="user.password" ng-disabled="loading" ng-keypress="!LoginForm.$invalid && $event.keyCode == 13 && login()" type="password" required> </md-input-container> </div> </form> </div> </md-content> <md-card-actions layout="row" layout-align="space-between center" ng-show="loginForm && !loading"> <md-button class="md-primary md-raised" ng-click="guestLogin()">Accedi come Ospite </md-button> <md-button class="md-primary md-raised" ng-disabled="LoginForm.$invalid" ng-click="login()">Login </md-button> </md-card-actions> </md-card> </div> </md-content>'),a.put("views/main.html","<h1>It works</h1>"),a.put("views/problems.html",'<md-card layout-fill class="no-padding" ng-if="!problemId && !loading"> <md-list class="no-padding"> <md-list-item class="md-2-line" ng-repeat="problem in problems" ng-click="openProblem(problem.id)"> <md-icon md-font-icon="fa-code" class="fa" style="font-size: 38px"></md-icon> <div class="md-list-item-text"> <h3>{{problem.title}}</h3> <!-- <p>Linea aggiuntiva non utilizzata</p> --> </div> </md-list-item> </md-list> </md-card> <md-card layout-padding ng-if="problemId && !loading"> <md-content style="background-color: inherit"> <h2 class="cardHeader problem"> {{problem.title}} (<span class="monospace">{{problem.short_title}}</span>) </h2> <md-tabs md-dynamic-height md-border-bottom> <md-tab label="Testo"> <div style="position: relative; min-height: 200px; clear: both"> <embed ng-if="problem.pdf" style="width: 100%; height: 85vh" ng-src="{{problem.pdf}}"> <md-progress-circular ng-if="pdfLoading" style="left: calc(50% - 25px); top: calc(50% - 25px); position: absolute" md-mode="indeterminate"></md-progress-circular> <h1 ng-if="!pdfLoading && !problem.pdf" style="text-align: center; padding-top: 90px">Testo attualmente non disponibile</h1> </div> </md-tab> <md-tab label="Sottomissioni"> <div> <form name="submitForm"> <div layout-gt-sm="row" style="justify-content: space-around"> <div ngf-select ngf-drop ngf-change="setFile(\'sourceFile\', $files)" class="drop-box with-margin" ng-class="{\'dark\': currentThemeObj.isDark}" ngf-drag-over-class="\'dragover\'"> Codice Sorgente <div class="filename" ng-if="problem.sourceFile"> {{problem.sourceFile.name}} - {{problem.sourceFile.size | fileSizeFormatter}} </div> </div> <div ngf-no-file-drop>Drag and Drop non disponibile. Fare click per caricare</div> </div> </form> </div> <md-content layout="row" layout-align="end center" style="background-color: inherit"> <md-button class="md-primary md-raised" ng-click="submit()">Sottometti </md-button> </md-content> </md-tab> </md-tabs> </md-content> </md-card>'),a.put("views/tasks.html",'<md-card layout-fill class="no-padding" ng-if="!taskId && !loading"> <md-button class="md-primary md-raised" ng-if="isTeacherOnly" ng-click="$location.path(\'/tasks/new\')">Nuovo Problema </md-button> <md-list class="no-padding"> <md-list-item class="md-2-line" ng-repeat="task in tasks" ng-click="openTask(task.id)"> <md-icon md-font-icon="fa-tasks" class="fa" style="font-size: 38px"></md-icon> <div class="md-list-item-text"> <h3>{{task.title}}</h3> <!-- <p>Linea aggiuntiva non utilizzata</p> --> </div> <md-button ng-if="isTeacherOnly" class="md-secondary md-icon-button md-raised" ng-click="deleteTask(task.id, $index, $event)" aria-label="call"> <md-icon md-font-icon="fa-trash" class="fa" style="font-size: 25px"></md-icon> </md-button> </md-list-item> </md-list> </md-card> <md-card layout-padding ng-if="taskId && !loading"> <h2 class="cardHeader">{{taskId == \'new\' ? \'Aggiungi\' : \'Dettagli\'}} Problema</h2> <md-content style="background-color: inherit"> <div> <form name="taskForm"> <div layout-gt-sm="row"> <md-input-container class="md-block" flex-gt-sm> <label>Titolo</label> <input ng-model="task.title" required ng-disabled="!isTeacherOnly"> </md-input-container> <md-input-container class="md-block" flex-gt-sm> <label>Sottotitolo</label> <input ng-model="task.short_title" required ng-disabled="!isTeacherOnly"> </md-input-container> <md-input-container class="md-block" flex-gt-sm> <md-checkbox ng-model="task.is_public" ng-true-value="\'1\'" ng-false-value="\'0\'" aria-label="Is Public" style="margin: auto" ng-disabled="!isTeacherOnly"> Problema Pubblico </md-checkbox> </md-input-container> </div> <div layout-gt-sm="row"> <md-input-container class="md-block" flex-gt-sm> <label>Livello</label> <md-select ng-model="task.level" required ng-disabled="!isTeacherOnly"> <md-option ng-repeat="num in [1, 2, 3, 4, 5, 6, 7, 8]" ng-value="num"> {{num}} </md-option> </md-select> </md-input-container> <md-input-container class="md-block" flex-gt-sm> <label>Categoria</label> <md-select ng-model="task.category_id" required ng-disabled="!isTeacherOnly"> <md-option ng-repeat="categoria in categorie" ng-value="categoria.id"> {{categoria.name}} </md-option> </md-select> </md-input-container> <md-input-container class="md-block" flex-gt-sm> <!-- TODO: mostrare messaggio di errore per valore non valido --> <label>Numero di Test Case</label> <input type="number" step="1" ng-model="task.test_cases" min="1" max="50" required ng-disabled="!isTeacherOnly"> </md-input-container> </div> <div layout-gt-sm="row" style="justify-content: space-around"> <div ngf-select ngf-drop ngf-change="setFile(\'description\', $files)" class="drop-box" ngf-drag-over-class="\'dragover\'" ng-style="mdMedia(\'gt-sm\') ? {} : {\'width\': \'inherit\'}" ng-class="{\'dark\': currentThemeObj.isDark}" ng-disabled="!isTeacherOnly"> Descrizione <div class="filename" ng-if="task.description"> {{task.description.name}} - {{task.description.size | fileSizeFormatter}} </div> </div> <div ngf-no-file-drop>Drag and Drop non disponibile</div> <div ngf-select ngf-drop ngf-change="setFile(\'solution\', $files)" class="drop-box" ngf-drag-over-class="\'dragover\'" ng-style="mdMedia(\'gt-sm\') ? {} : {\'width\': \'inherit\', \'margin-top\': \'15px\', \'margin-left\': 0}" ng-class="{\'dark\': currentThemeObj.isDark}" ng-disabled="!isTeacherOnly"> Soluzione <div class="filename" ng-if="task.solution"> {{task.solution.name}} - {{task.solution.size | fileSizeFormatter}} </div> </div> <div ngf-no-file-drop>Drag and Drop non disponibile</div> <div ngf-select ngf-drop ngf-change="setFile(\'material\', $files)" class="drop-box" ngf-drag-over-class="\'dragover\'" ng-style="mdMedia(\'gt-sm\') ? {} : {\'width\': \'inherit\', \'margin-top\': \'15px\', \'margin-left\': 0}" ng-class="{\'dark\': currentThemeObj.isDark}" ng-disabled="!isTeacherOnly"> Materiale <div class="filename" ng-if="task.material"> {{task.material.name}} - {{task.material.size | fileSizeFormatter}} </div> </div> <div ngf-no-file-drop>Drag and Drop non disponibile</div> </div> </form> </div> </md-content> <md-content layout="row" layout-align="end center" style="background-color: inherit"> <md-button class="md-primary md-raised" ng-if="isTeacherOnly" ng-disabled="taskId == \'new\' && (taskForm.$invalid || !task.description || !task.solution || !task.material)" ng-click="save()">Salva </md-button> </md-content> </md-card>'),a.put("views/teachers.html",'<md-card layout-fill class="no-padding" ng-if="!teacherId && !loading"> <md-button class="md-primary md-raised" ng-click="$location.path(\'/teachers/new\')">Aggiungi Docente</md-button> <md-list class="no-padding"> <md-list-item class="md-2-line" ng-repeat="teacher in teachers" ng-click="openTeacher(teacher.id)"> <md-icon md-font-icon="fa-graduation-cap" class="fa" style="font-size: 38px"></md-icon> <div class="md-list-item-text"> <h3>{{teacher.name}} {{teacher.surname}}</h3> <p>{{teacher.username}}</p> </div> <md-button class="md-secondary md-icon-button md-raised" ng-click="deleteTeacher(teacher.id, $index, $event)" aria-label="call"> <md-icon md-font-icon="fa-trash" class="fa" style="font-size: 25px"></md-icon> </md-button> </md-list-item> </md-list> </md-card> <md-card layout-padding ng-if="teacherId && !loading"> <h2 class="cardHeader">{{teacherId == \'new\' ? \'Aggiungi\' : \'Modifica\'}} Docente</h2> <md-content style="background-color: white"> <div> <form name="teacherForm"> <div layout-gt-sm="row"> <md-input-container class="md-block" flex-gt-sm> <label>Nome</label> <input ng-model="user.name" required> </md-input-container> <md-input-container class="md-block" flex-gt-sm> <label>Cognome</label> <input ng-model="user.surname" required> </md-input-container> </div> <div layout-gt-sm="row"> <md-input-container class="md-block" flex-gt-sm> <label>Username</label> <input ng-model="user.username" required> </md-input-container> </div> <div layout-gt-sm="row"> <md-input-container class="md-block" flex-gt-sm> <label>Password</label> <input ng-model="user.password" type="password"> </md-input-container> <md-input-container class="md-block" flex-gt-sm> <label>Conferma Password</label> <input ng-model="user.password2" type="password"> </md-input-container> </div> </form> </div> </md-content> <md-content layout="row" layout-align="end center" style="background-color: white"> <md-button class="md-primary md-raised" ng-disabled="teacherForm.$invalid || user.password != user.password2 || (teacherId == \'new\' && user.password.length == 0)" ng-click="save()">Salva </md-button> </md-content> </md-card>')}]);