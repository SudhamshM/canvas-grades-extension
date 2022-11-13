'use strict';

async function mainest()
{

    const resp = await fetch('https://uncc.instructure.com/api/v1/courses')
    // if request fails maybe because of not being logged in
    if (!resp.ok)
    {
        swapDOM();
        return;
    }
    const data = Array.from(await resp.json());
    console.log(data);

    // populate table with array data
    data.forEach(course =>
        {
            const tr = document.createElement('tr')
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            if (!course['name'] || !course['uuid'])
            {
                return;
            }
            td1.textContent = course['name'];
            td2.textContent = course['uuid'];
            tr.append(td1, td2);

            const tableBase = document.querySelector('tbody');
            tableBase.appendChild(tr);

        })
}

const swapDOM = () =>
{
    document.querySelector('body').textContent = 'Make sure you are logged in to Canvas.'
    return;
}

window.addEventListener('load', mainest)