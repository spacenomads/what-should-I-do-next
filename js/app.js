'use strict';
const html = document.querySelector('html');
const app = html.querySelector('.js__app');
const appPage = app.querySelector('.js__app-main');
const fields = app.querySelectorAll('.js__app-field');
const chooseTaskBtn = app.querySelector('.js__app-btn');
const appResult = app.querySelector('.js__app-result');
const appResutlTask = app.querySelector('.js__app-result-task');
const appReset = app.querySelector('.js__app-reset');
const appHistoryList = app.querySelector('.js__app-history-items');
const appDeleteHistoryBtn = app.querySelector('.js__app-delete-history');
const appMenutrigger = app.querySelector('.js__app-menu-trigger');
const appMenuClose = app.querySelector('.js__app-menu-close');
const appModalCLose =  app.querySelectorAll('.js__app-modal-close');
const appMenuModal = app.querySelectorAll('.js__menu-modal');
const appExtLinks = app.querySelectorAll('.js__link-ext');


let tasks = {};
let taskHistory = [];

function checkFieldStatus(element) {
	if (element.value) {
		element.classList.add('app__task-field--filled');
	} else {
		element.classList.remove('app__task-field--filled');
	}
}

function deleteTasksHistory() {
	taskHistory = [];
	localStorage.removeItem('savedTasksHistory');
	updateUserHistory();
}

function getTimestamp() {
	const now = new Date();

	const dd = (now.getDate() < 10) ? '0' + now.getDate() : now.getDate();
	const mm = (now.getMonth() < 10) ? '0' + now.getMonth() : now.getMonth();
	const yyyy = now.getFullYear();

	return `${dd}.${mm}.${yyyy}`;
}

function updateUserHistory() {
	let historyItems = '';
	for (const item of taskHistory) {
		historyItems += `
			<li class="app__history-item">
				<time class="app__history-item-timestamp">${item.date}</time>
				<p class="app__history-item-label">${item.task}</p>
			</li>
		`;
	}
	appHistoryList.innerHTML = historyItems;
}

function addTaskToHistory(task) {
	const newTaskData = {
		date: getTimestamp(),
		task: task
	};
	if (taskHistory.findIndex(el => (el.date === newTaskData.date && el.task === newTaskData.task)) < 0) {
		taskHistory.push(newTaskData);
		localStorage.setItem('savedTasksHistory', JSON.stringify(taskHistory));
		updateUserHistory();
	}
}

function showResult() {
	const selectedTask = tasks.userTasks[tasks.selected];
	appResutlTask.innerHTML = selectedTask;
	appResult.classList.add('tpl-result--visible');
	addTaskToHistory(selectedTask);
}
function hideResults() {
	appResult.style.height = '100%';
	appResult.classList.remove('tpl-result--visible');
	setTimeout(function(){
		appResult.removeAttribute('style');
	}, 1500);
}
function writeSavedTasks() {
	for (let i=0; i<tasks.userTasks.length; i++) {
		fields[i].value = tasks.userTasks[i];
	}
}

function areWeDone() {
	if (tasks.completed && tasks.selected) {
		showResult();
	} else {
		checkTasksCompletion();
	}
}

function initTaskData() {
	const data = JSON.parse(localStorage.getItem('savedTasks'));
	tasks = data ? data : {
		current: 0,
		completed: false,
		userTasks: ['','',''],
		selected: undefined,
	};
	writeSavedTasks();
}

function initTaskHistory() {
	const data = JSON.parse(localStorage.getItem('savedTasksHistory'));
	taskHistory = data ? data : [];
	updateUserHistory();
}

function saveData() {
	localStorage.setItem('savedTasks', JSON.stringify(tasks));
}

function chooseOneTask() {
	const randomIndex = Math.floor(Math.random()*3);
	tasks.selected = randomIndex;
	showResult();
	saveData();
}

function enableChooseTaskBtn() {
	chooseTaskBtn.disabled = false;
	chooseTaskBtn.classList.remove('app__choose-task--disabled');
}
function disableChooseTaskBtn() {
	chooseTaskBtn.disabled = true;
	chooseTaskBtn.classList.add('app__choose-task--disabled');
}

function goToNextEmptyTask() {
	if (tasks.current >= tasks.userTasks.length - 1) {
		tasks.current = 0;
	} else {
		tasks.current++;
	}
	if (tasks.userTasks[tasks.current] === '') {
		fields[tasks.current].focus();
	} else {
		goToNextEmptyTask();
	}
}

function updateFocus() {
	if (tasks.completed) {
		enableChooseTaskBtn();
		chooseTaskBtn.focus();
	} else {
		goToNextEmptyTask();
	}
}

function areTheTasksCompleted() {
	let result = true;
	for (const task of tasks.userTasks) {
		if (!task) {
			result = false;
		}
	}
	return result;
}

function checkTasksCompletion() {
	if (tasks.completed) {
		enableChooseTaskBtn();
	} else {
		disableChooseTaskBtn();
	}
}


function getTask(event) {
	const field = event.currentTarget;
	const index = parseInt(field.dataset.index);
	tasks.current = index;
	if (event.key === 'Enter' || event.which === 13 || event.keyCode === 13) {
		updateFocus();
	} else {
		tasks.userTasks[index] = field.value;
		tasks.completed = areTheTasksCompleted();
		checkFieldStatus(field);
		checkTasksCompletion();
	}
	saveData();
}

function resetApp() {
	tasks.current= 0;
	tasks.completed= false;
	tasks.userTasks= ['','',''];
	tasks.selected= undefined;

	for (const field of fields) {
		field.value = '';
		field.classList.remove('app__task-field--filled');
	}

	disableChooseTaskBtn();
	saveData();
	hideResults();
}

function openMenu() {
	appPage.classList.add('app__main--with-menu');
}

function closeMenu() {
	appPage.classList.remove('app__main--with-menu');
}

function closeCurrentModal(event) {
	const modal = event.currentTarget.closest('.tpl-modal--visible');
	modal.style.height = '100%';
	modal.classList.remove('tpl-modal--visible');
	setTimeout(function(){
		modal.removeAttribute('style');
	}, 550);
}

function showModal(event) {
	event.preventDefault();
	const modalIdSelector = event.currentTarget.getAttribute('href');
	appPage.classList.remove('app__main--with-menu');
	setTimeout(function(){
		app.querySelector(modalIdSelector).classList.add('tpl-modal--visible');
	}, 250);
	
}

function initAppModals() {
	for (const modal of appModalCLose) {
		modal.addEventListener('click', closeCurrentModal);
	}
	for (const modal of appMenuModal) {
		modal.addEventListener('click', showModal);
	}
}

function initExternalLinks() {
	console.log('entra');
	for (const link of appExtLinks) {
		console.log(link);
		link.setAttribute('target', '_blank');
		link.setAttribute('rel', 'external noopener noreferrer');
	}
}

function init() {
	html.classList.remove('no-js');
	html.classList.add('js');

	for (const field of fields) {
		field.addEventListener('keyup', getTask);
	}
	chooseTaskBtn.addEventListener('click', chooseOneTask);
	appReset.addEventListener('click', resetApp);
	appDeleteHistoryBtn.addEventListener('click', deleteTasksHistory);
	appMenutrigger.addEventListener('click', openMenu);
	appMenuClose.addEventListener('click', closeMenu);
	initExternalLinks();
	initAppModals();
	initTaskHistory();
	initTaskData();
	areWeDone();
}

init();