// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.fa-bars').addEventListener('click', toggleMenu);
    document.querySelector('#toggle-mode').addEventListener('click', toggleMode);
    document.querySelector('#submit').addEventListener('click', handleSubmit);
    
});

// Function to toggle the menu
function toggleMenu() {
    const nav = document.querySelector('.navbar .right');
    nav.style.display = nav.style.display === 'block' ? 'none' : 'none';
}

// Function to toggle dark and light modes
function toggleMode() {
    document.body.classList.toggle('dark-mode');
}

// Function to handle form submission or button click
document.addEventListener("DOMContentLoaded", function() {
    const button1 = document.querySelector('#submit');

    function handleSubmit(event) {
        event.preventDefault();
        alert('Form Submitted or Button Clicked!');
    }

    if (button1) {
        button1.addEventListener('click', handleSubmit);
    }
});


// Function to handle button click to show pending process
document.addEventListener("DOMContentLoaded", function() {
    const button = document.querySelector('#submit1');


function handleSubmit(event) {
    event.preventDefault();
    button.textContent = 'Pending';
    button.style.backgroundColor = 'green';
    button.style.color = 'white';
    
    // Simulating a delay to show the change
    setTimeout(() => {
        button.textContent = 'ENROLL TODAY';
        button.style.backgroundColor = '';
        button.style.color = '';
    }, 4000);
}

if (button) {
    button.addEventListener('click', handleSubmit);
}

});


// Function to handle button click to show pending process
document.addEventListener("DOMContentLoaded", function() {
    const button2 = document.querySelector('#submit2');


function handleSubmit(event) {
    event.preventDefault();
    button2.textContent = 'Send us an email';
    button2.style.backgroundColor = 'blue';
    button2.style.color = 'white';
    
    // Simulating a delay to show the change
    setTimeout(() => {
        button2.textContent = 'ENROLL TODAY';
        button2.style.backgroundColor = '';
        button2.style.color = '';
    }, 4000);
}

if (button2) {
    button2.addEventListener('click', handleSubmit);
}

});




// DOM manipulation and Server communication

document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search");
    const div1 = document.querySelector(".div1");
    const div2 = document.querySelector(".div2");
    const programDetails = document.getElementById("program-details");
    const specialRequestForm = document.getElementById("special-request-form");
    const message = document.getElementById("message");

    // Function to display programs on the page
    function displayPrograms(programs) {
        div1.innerHTML = "";
        div2.innerHTML = "";
        programs.forEach((program, index) => {
            const programDiv = document.createElement("div");
            programDiv.classList.add(`path${index + 1}`);
            programDiv.innerHTML = `
                <a href="#" class="program" data-id="${program.id}"><img src="${program.image}" alt="${program.name}"></a>
                <h2>${program.name}</h2>
                <p>${program.category}</p>
                <button>Apply</button>
            `;
            if (index < 3) {
                div1.appendChild(programDiv);
            } else {
                div2.appendChild(programDiv);
            }
        });

        // Add click event listeners to program links
        document.querySelectorAll(".program").forEach(item => {
            item.addEventListener("click", function(event) {
                event.preventDefault();
                const id = this.getAttribute("data-id");
                const program = programs.find(p => p.id == id);
                displayProgramDetails(program);
            });
        });
    }

    // Function to display details of a selected program
    function displayProgramDetails(program) {
        programDetails.style.display = "block";
        programDetails.querySelector("#program-name").textContent = program.name;
        programDetails.querySelector("#program-category").textContent = program.category;
        programDetails.querySelector("#program-description").textContent = program.description;
        programDetails.querySelector("#program-info").textContent = program.info;
    }

    // Handle search input for filtering programs
    searchInput.addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        fetchPrograms().then(programs => {
            const filteredPrograms = programs.filter(program => 
                program.name.toLowerCase().includes(searchTerm) ||
                program.category.toLowerCase().includes(searchTerm) ||
                program.description.toLowerCase().includes(searchTerm)
            );
            displayPrograms(filteredPrograms);
        });
    });

    // Function to handle special request form submission

    specialRequestForm.addEventListener("submit", function(event) {
        event.preventDefault();
    });

    function handleSubmit(event) {
        event.preventDefault();
        
        const name = document.getElementById("special-request-name").value;
        const category = document.getElementById("special-request-category").value;
        const description = document.getElementById("special-request-description").value;
    
        const newProgram = {
            name,
            category,
            description
        };
    
        fetch('http://localhost:3000/desiredprogram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProgram)
        })
        .then(response => response.json())
        .then(data => {
            message.style.display = "block";
            setTimeout(() => {
                message.style.display = "none";
            }, 2000);
            console.log('Desired request submitted:', data);
            specialRequestForm.reset();
        })
        .catch(error => {
            console.error('Error submitting desired request:', error);
        });
    }
    
    searchInput.addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        searchPrograms(searchTerm);
    });
    
    specialRequestForm.addEventListener("submit", handleSubmit);



    // Function to fetch programs from the server
    function fetchPrograms() {
        return fetch('http://localhost:3000/programs')
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching programs:', error);
            });
    }

    // Initial fetch and display of programs
    fetchPrograms().then(programs => {
        displayPrograms(programs);
    });
});
