const express = require('express');
const { uuid, isUuid } = require('uuidv4')

const app = express();

// fazendo o express enterder JSON
app.use(express.json());

const projects = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next(); // próximo middleware

  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'invalid project id '});
  }

  return next();
}

// usa o middleware em todas as rotas
app.use(logRequests);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
  // query params
  // const query = request.query;
  const { title } = request.query;

  const result = title 
   ? projects.filter(project => project.title.includes(title))
   : projects;
  
  // console.log(query);
  // console.log(title);
  // console.log(owner);

  return response.json(result);
});

// app.get('/projects', logRequests, (request, response) => {
//   // query params
//   // const query = request.query;
//   const { title } = request.query;

//   const result = title 
//    ? projects.filter(project => project.title.includes(title))
//    : projects;
  
//   // console.log(query);
//   // console.log(title);
//   // console.log(owner);

//   return response.json(result);
// });

app.post('/projects', (request, response) => {
  // const body = request.body;
  const { title, owner } = request.body;

  // console.log(title);
  // console.log(owner);

  const project = { id: uuid(), title, owner };

  projects.push(project);
  
  // retorna o project recem criado
  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
  // const params = request.params;
  const { id } = request.params;
  const { title, owner } = request.body;

  // buscar o id do projeto
  const projectIndex = projects.findIndex(project => project.id === id);

  if(projectIndex < 0) {
    return response.status(400).json({ error: 'project not found'});
  }

  const project = {
    id,
    title,
    owner
  };

  projects[projectIndex] = project;

  // console.log(id);
  
  // aqui também pode usar o request.body
  return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "project not found" });
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});


app.listen(3333, () => {
  console.log('🚀  Back-end started');
});