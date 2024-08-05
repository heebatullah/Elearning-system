document.addEventListener('DOMContentLoaded', () => {
    // Event listeners for various elements
    document.querySelector('.fa-bars').addEventListener('click', toggleMenu);
    document.querySelector('#toggle-mode').addEventListener('click', toggleMode);
    document.querySelector('#submit').addEventListener('click', handleSubmit);
    document.querySelector('#submit1').addEventListener('click', handleApplyClick);


    // Function to toggle the menu
    function toggleMenu() {
        const nav = document.querySelector('.navbar .right');
        nav.style.display = nav.style.display === 'block' ? 'none' : 'none';
    }

    // Function to toggle dark and light modes
    function toggleMode() {
        document.body.classList.toggle('dark-mode');
    }

    // Handle form submission (for placeholder purposes)
    function handleSubmit(event) {
        event.preventDefault();
        alert('Form Submitted or Button Clicked!');
    }

    // Handle apply button click
    function handleApplyClick(event) {
        event.preventDefault();
        const button = event.target;
        const programId = button.dataset.id;

        button.textContent = 'Pending';
        button.style.backgroundColor = 'green';
        button.style.color = 'white';
        
        // Simulate a delay to show the change
        setTimeout(() => {
            button.textContent = 'ENROLLED!';
            button.style.backgroundColor = '';
            button.style.color = '';
            enrollInProgram(programId);
        }, 4000);
    }
    
    

    // Enroll in the selected program
    function enrollInProgram(programId) {
        fetch(`http://localhost:3000/programs/${programId}`)
            .then(response => response.json())
            .then(program => {
                const remainingSlots = program.capacity - program.enrolled_students;

                if (remainingSlots > 0) {
                    const updatedProgram = {
                        ...program,
                        enrolled_students: program.enrolled_students + 1
                    };

                    fetch(`http://localhost:3000/programs/${programId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedProgram)
                    })
                    .then(response => response.json())
                    .then(updatedProgram => {
                        updateRemainingSlots(programId, updatedProgram);
                    })
                    .catch(error => console.error('Error updating program:', error));
                } else {
                    alert('No remaining slots available for this program.');
                }
            })
            .catch(error => console.error('Error fetching program details:', error));
    }

    // Update the remaining slots on the UI
    function updateRemainingSlots(programId, updatedProgram) {
        const programDiv = document.querySelector(`.program[data-id="${programId}"]`);
        if (programDiv) {
            const remainingSlots = updatedProgram.capacity - updatedProgram.enrolled_students;
            programDiv.querySelector('.remaining-slots').textContent = `Remaining Slots: ${remainingSlots}`;
        }
    }

    // Display programs on the page
    function displayPrograms(programs) {
        const div1 = document.querySelector('.div1');
        const div2 = document.querySelector('.div2');
        div1.innerHTML = '';
        div2.innerHTML = '';

        programs.forEach((program, index) => {
            const programDiv = document.createElement('div');
            programDiv.classList.add('program');
            programDiv.dataset.id = program.id;
            programDiv.innerHTML = `
                <a href="#" class="program-link" data-id="${program.id}"><img src="${program.image}" alt="${program.name}"></a>
                <h2>${program.name}</h2>
                <p>${program.category}</p>
                <p class="remaining-slots">Remaining Slots: ${program.capacity - program.enrolled_students}</p>
                <button class="apply-button" data-id="${program.id}">Apply</button>
            `;
            if (index < 3) {
                div1.appendChild(programDiv);
            } else {
                div2.appendChild(programDiv);
            }
        });

        // Add click event listeners to program links and apply buttons
        document.querySelectorAll('.program-link').forEach(item => {
            item.addEventListener('click', function(event) {
                event.preventDefault();
                const id = this.getAttribute('data-id');
                const program = programs.find(p => p.id == id);
                displayProgramDetails(program);
            });
        });

        document.querySelectorAll('.apply-button').forEach(button => {
            button.addEventListener('click', handleApplyClick);
        });
    }

    // Display program details in section
    function displayProgramDetails(program) {
        const programDetails = document.getElementById('program-details');
        programDetails.style.display = 'block';
        programDetails.querySelector('#program-name').textContent = program.name;
        programDetails.querySelector('#program-category').textContent = program.category;
        programDetails.querySelector('#program-description').textContent = program.description;
        programDetails.querySelector('#program-info').textContent = program.info;
        
    }

    // Handle search functionality
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', function() {
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

    // Handle special request form submission
    const specialRequestForm = document.getElementById('special-request-form');
    specialRequestForm.addEventListener('submit', function(event) {
        event.preventDefault();
        handleSpecialRequestSubmit();
    });

    function handleSpecialRequestSubmit() {
        const name = document.getElementById('special-request-name').value;
        const category = document.getElementById('special-request-category').value;
        const description = document.getElementById('special-request-description').value;
    
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
            document.getElementById('message').style.display = 'block';
            setTimeout(() => {
                document.getElementById('message').style.display = 'none';
            }, 2000);
            console.log('Desired request submitted:', data);
            specialRequestForm.reset();
        })
        .catch(error => {
            console.error('Error submitting desired request:', error);
        });
    }

    // Fetch and display programs initially
    function fetchPrograms() {
        return fetch('http://localhost:3000/programs')
            .then(response => response.json())
            .catch(error => console.error('Error fetching programs:', error));
    }

    fetchPrograms().then(programs => {
        displayPrograms(programs);
    });
});
