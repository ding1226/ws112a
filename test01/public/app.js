document.addEventListener('DOMContentLoaded', () => {
  const courseList = document.getElementById('course-list');
  const userList = document.getElementById('user-list');
  const addCourseForm = document.getElementById('add-course-form');
  const addUserForm = document.getElementById('add-user-form');

  const fetchCourses = async () => {
    const response = await fetch('/courses');
    const courses = await response.json();

    courseList.innerHTML = '';
    courses.forEach(course => {
      const listItem = document.createElement('li');
      listItem.textContent = `${course.title} - ${course.instructor}: ${course.description}`;
      courseList.appendChild(listItem);
    });
  };

  const fetchUsers = async () => {
    const response = await fetch('/users');
    const users = await response.json();

    userList.innerHTML = '';
    users.forEach(user => {
      const listItem = document.createElement('li');
      listItem.textContent = `${user.username} - ${user.email}`;
      userList.appendChild(listItem);
    });
  };

  addCourseForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('course-title').value
