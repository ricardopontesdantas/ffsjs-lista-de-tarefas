const Main = {
    tasks: [],

    init: function() {
        this.cacheSelectors()
        this.bindEvents()
        this.getStoraged()
        this.buildTasks()
    },

    cacheSelectors: function() {
        this.$checkButtons = document.querySelectorAll('.check')
        this.$inputTask = document.querySelector('#inputTask')
        this.$list = document.querySelector('#list')
        this.$removeButtons = document.querySelectorAll('.remove')
    },

    bindEvents: function() {
        const self = this

        this.$checkButtons.forEach(function(button) {
            button.onclick = self.Events.checkButton_click
        })

        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

        this.$removeButtons.forEach(function(button) {
            button.onclick = self.Events.removeButton_click.bind(self)
        })
    },

    getStoraged: function() {
        const tasks = localStorage.getItem('tasks')

        if (tasks) {
            return this.tasks = JSON.parse(tasks)
        }

        this.tasks = localStorage.setItem('tasks', JSON.stringify([]))
    },

    getTaskHtml: function(task) {
        return `
            <li>
                <div class="check"></div>
                <label for="" class="task">${task}</label>
                <button class="remove" data-task="${task}"></button>
            </li>
        `
    },

    buildTasks: function() {
        let html = ''

        this.tasks.forEach(item => {
            html += this.getTaskHtml(item.task)
        })

        this.$list.innerHTML = html

        this.cacheSelectors()
        this.bindEvents()
    },

    Events: {
        checkButton_click: function(event) {
            const li = event.target.parentElement
            const isDone = li.classList.contains('done')

            if (!isDone) {
                return li.classList.add('done')
            }

            li.classList.remove('done')
        },

        inputTask_keypress: function(event) {
            const key = event.key
            const value = event.target.value
            const isEnterPressed = key === 'Enter'

            if (isEnterPressed) {
                this.$list.innerHTML += this.getTaskHtml(value)

                event.target.value = ''

                this.cacheSelectors()
                this.bindEvents()

                const savedTasks = localStorage.getItem('tasks')

                const savedTasksObj = JSON.parse(savedTasks)

                const obj = [
                    ...savedTasksObj,
                    { task: value, done: false },
                ]

                localStorage.setItem('tasks', JSON.stringify(obj))
            }
        },

        removeButton_click: function(event) {
            const li = event.target.parentElement
            const value = event.target.dataset.task
            
            const newTasksState = this.tasks.filter(item => item.task !== value)

            localStorage.setItem('tasks', JSON.stringify(newTasksState))

            li.classList.add('removed')

            setTimeout(function() {
                li.classList.add('hidden')
            }, 300)
        }
    },
}

Main.init()