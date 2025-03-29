// Модели данных
class Workout {
    constructor(id, name, date, exercises = [], duration = 0, notes = '') {
        this.id = id;
        this.name = name;
        this.date = date;
        this.exercises = exercises;
        this.duration = duration;
        this.notes = notes;
    }
}

class Exercise {
    constructor(id, name, sets = []) {
        this.id = id;
        this.name = name;
        this.sets = sets;
    }
}

class Set {
    constructor(id, reps, weight, duration = 0) {
        this.id = id;
        this.reps = reps;
        this.weight = weight;
        this.duration = duration;
    }
}

// Управление состоянием приложения
class AppState {
    constructor() {
        this.workouts = [];
        this.currentPage = 'workouts';
        this.loadData();
    }

    loadData() {
        const savedData = localStorage.getItem('workoutData');
        if (savedData) {
            this.workouts = JSON.parse(savedData);
        }
    }

    saveData() {
        localStorage.setItem('workoutData', JSON.stringify(this.workouts));
    }

    addWorkout(workout) {
        this.workouts.push(workout);
        this.saveData();
        this.updateUI();
    }

    deleteWorkout(workoutId) {
        this.workouts = this.workouts.filter(w => w.id !== workoutId);
        this.saveData();
        this.updateUI();
    }

    updateUI() {
        this.renderWorkouts();
        this.updateStats();
    }

    renderWorkouts() {
        const workoutList = document.querySelector('.workout-list');
        workoutList.innerHTML = '';

        this.workouts.forEach(workout => {
            const workoutCard = document.createElement('div');
            workoutCard.className = 'workout-card';
            workoutCard.innerHTML = `
                <h3>${workout.name}</h3>
                <p>${new Date(workout.date).toLocaleDateString()}</p>
                <p>Длительность: ${workout.duration} мин</p>
                <ul class="exercise-list">
                    ${workout.exercises.map(exercise => `
                        <li class="exercise-item">
                            ${exercise.name} - ${exercise.sets.length} подхода
                        </li>
                    `).join('')}
                </ul>
                <button onclick="app.deleteWorkout('${workout.id}')">Удалить</button>
            `;
            workoutList.appendChild(workoutCard);
        });
    }

    updateStats() {
        const totalWorkouts = this.workouts.length;
        const totalExercises = this.workouts.reduce((sum, w) => sum + w.exercises.length, 0);
        const totalDuration = this.workouts.reduce((sum, w) => sum + w.duration, 0);

        document.querySelector('.total-workouts').textContent = totalWorkouts;
        document.querySelector('.total-exercises').textContent = totalExercises;
        document.querySelector('.total-duration').textContent = `${totalDuration} мин`;
    }
}

// Инициализация приложения
const app = new AppState();

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    // Навигация
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            app.currentPage = page;
            
            // Обновляем активный элемент навигации
            navItems.forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            // Показываем соответствующую страницу
            document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
            document.querySelector(`.${page}-page`).style.display = 'block';
        });
    });

    // Добавление новой тренировки
    document.querySelector('.add-workout-btn').addEventListener('click', () => {
        const name = prompt('Введите название тренировки:');
        if (name) {
            const workout = new Workout(
                Date.now().toString(),
                name,
                new Date().toISOString()
            );
            app.addWorkout(workout);
        }
    });

    // Инициализация UI
    app.updateUI();
}); 