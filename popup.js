'use strict';
let userID = ''
async function mainest() {

    const resp = await fetch('https://uncc.instructure.com/api/v1/courses')
    // if request fails maybe because of not being logged in
    if (!resp.ok) {
        swapDOM();
        return;
    }
    const data = Array.from(await resp.json());
    console.log(data);
    
    userID = data[0]['enrollments'][0]['user_id'];
    const courseResp = await fetch(`https://uncc.instructure.com/api/v1/users/${userID}/enrollments`)
    const parsed = Array.from(await courseResp.json());
    console.log(userID);

    // populate table with array data
    let i = 0;
    
    data.forEach(course => {
        const tr = document.createElement('tr')
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');

        getEnrollments(i, {td1, td2, tr}, parsed);

        if (!course['name'] || !course['uuid']) {
            i++;
            return;
        }

        const tableBase = document.querySelector('tbody');
        tableBase.appendChild(tr);
        i++;
    })
    document.querySelector('.removable').remove();
}

async function getEnrollments(index, {td1, td2, tr}, parsed) {
    let currentData = 0
    parsed.forEach(async course=>
        {
            if (!((String) (course['updated_at']).startsWith('2022-08')))
            {
                return;
            }
            currentData = parsed[index]['grades']['current_score'];
            if (currentData == null)
            {
                return;
            }
            if (currentData >= 90)
            {
                td2.style.backgroundColor = '#6ee080';            
            }
            else if (currentData <90 && currentData >= 80)
            {
                td2.style.backgroundColor = '#d4ed5e';
            }
            else if (currentData < 70 && currentData >= 60)
            {
                td2.style.backgroundColor = '#fce43a';
            }
            const courseID = parsed[index]['course_id'];
            const nameHeaders = await fetch(`https://uncc.instructure.com/api/v1/courses/${courseID}`)
            const parsedName = await nameHeaders.json();
            // get currently enrolled courses with null start time
            if (parsedName['start_at'] == null)
            {
                td1.textContent = parsedName['name'];
                td2.textContent = currentData + "%";
                tr.append(td1, td2);
                return;
            }
        })
}

const swapDOM = () => {
    document.querySelector('.content').textContent = ''
    document.querySelector('h1').textContent = 'Make sure you are logged in to Canvas.';
    document.querySelector('body').style.width = '200px';
    return;
}

window.addEventListener('load', mainest)