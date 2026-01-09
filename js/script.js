// 1. Selectors (Memilih Elemen HTML)
const todoInput = document.querySelector(".todo-input");
const dateInput = document.querySelector(".date-input");
const todoButton = document.querySelector(".todo-btn");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector("#filter-todo");
const clearBtn = document.querySelector("#clear-all-btn");
const emptyState = document.getElementById("empty-state");

// 2. Event Listeners (Mendengar Aksi User)
// Saat tombol tambah diklik (atau Enter ditekan pada form)
document.getElementById("todo-form").addEventListener("submit", addTodo);
// Saat area list diklik (untuk tombol delete/check)
todoList.addEventListener("click", deleteCheck);
// Saat filter diubah
filterOption.addEventListener("change", filterTodo);
// Saat tombol hapus semua diklik
clearBtn.addEventListener("click", clearAll);
// Cek status kosong saat pertama load
document.addEventListener("DOMContentLoaded", checkEmpty);

// 3. Functions (Logika Program)

function addTodo(event) {
    // Mencegah form submit default (refresh halaman)
    event.preventDefault();

    // Validasi sederhana (HTML5 required sudah ada, ini double check)
    if (todoInput.value === "" || dateInput.value === "") {
        alert("Mohon isi nama tugas dan tanggalnya!");
        return;
    }

    // A. Membuat Wrapper DIV 'todo'
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // B. Membuat List Item
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // C. Membuat Elemen Tanggal
    const todoDate = document.createElement("span");
    todoDate.innerText = formatDate(dateInput.value); // Format tanggal biar cantik
    todoDate.classList.add("due-date");
    todoDiv.appendChild(todoDate);

    // D. Tombol Selesai (Check Button)
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("check-btn");
    todoDiv.appendChild(completedButton);

    // E. Tombol Hapus (Trash Button)
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    // F. Masukkan ke dalam List Utama
    todoList.appendChild(todoDiv);

    // G. Reset Input & Cek Empty State
    todoInput.value = "";
    dateInput.value = "";
    checkEmpty();
}

function deleteCheck(e) {
    const item = e.target;
    
    // Mencegah error jika user klik di celah antar tombol
    if (!item.parentElement) return;

    // A. HAPUS TUGAS
    if (item.classList.contains("trash-btn") || item.parentElement.classList.contains("trash-btn")) {
        // Cari parent element div.todo (karena tombol ada di dalamnya)
        const todo = item.closest(".todo");
        
        // Tambahkan class animasi 'fall' (dari CSS)
        todo.classList.add("fall");
        
        // Tunggu animasi selesai baru dihapus dari DOM
        todo.addEventListener("transitionend", function() {
            todo.remove();
            checkEmpty(); // Cek lagi apakah list jadi kosong
        });
    }

    // B. TANDAI SELESAI
    if (item.classList.contains("check-btn") || item.parentElement.classList.contains("check-btn")) {
        const todo = item.closest(".todo");
        todo.classList.toggle("completed");
        // Update filter realtime jika sedang dalam mode filter tertentu
        // filterTodo(); // Opsional: aktifkan jika ingin item langsung hilang saat di-check di mode 'uncompleted'
    }
}

function filterTodo(e) {
    const todos = todoList.childNodes;
    
    todos.forEach(function(todo) {
        // Pastikan yang dicek adalah element HTML (nodeType 1), bukan text/spasi kosong
        if (todo.nodeType === 1) { 
            const filterValue = e ? e.target.value : filterOption.value; // Handle event atau direct call

            switch (filterValue) {
                case "all":
                    todo.style.display = "flex";
                    break;
                case "completed":
                    if (todo.classList.contains("completed")) {
                        todo.style.display = "flex";
                    } else {
                        todo.style.display = "none";
                    }
                    break;
                case "uncompleted":
                    if (!todo.classList.contains("completed")) {
                        todo.style.display = "flex";
                    } else {
                        todo.style.display = "none";
                    }
                    break;
            }
        }
    });
}

function clearAll(e) {
    e.preventDefault();
    if(confirm("Yakin ingin menghapus semua tugas?")) {
        todoList.innerHTML = "";
        checkEmpty();
    }
}

// Fungsi Helper: Format Tanggal (YYYY-MM-DD -> DD/MM/YYYY)
function formatDate(dateString) {
    if(!dateString) return "";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Fungsi Helper: Tampilkan gambar kosong jika tidak ada tugas
function checkEmpty() {
    if (todoList.children.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }
}