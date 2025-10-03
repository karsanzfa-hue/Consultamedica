let consultas = [];
let farmacia = [];

function registrarConsulta() {
  const nombre = document.getElementById('nombreConsulta').value.trim();
  const dni = document.getElementById('dniConsulta').value.trim();
  const motivo = document.getElementById('motivoConsulta').value.trim();

  if (!validarCampos(nombre, dni, motivo)) return;

  consultas.push({ nombre, dni, motivo });
  mostrarConsultas();
  actualizarListaPacientesFarmacia();
  limpiarCampos(['nombreConsulta', 'dniConsulta', 'motivoConsulta']);
}

function registrarFarmacia() {
  const nombre = document.getElementById('nombreFarmacia').value;
  const dni = document.getElementById('dniFarmacia').value.trim();
  const medicamento = document.getElementById('medicamento').value;

  if (!validarCampos(nombre, dni, medicamento)) return;

  farmacia.push({ nombre, dni, medicamento });
  mostrarFarmacia();
  limpiarCampos(['nombreFarmacia', 'dniFarmacia', 'medicamento']);
  actualizarListaPacientesFarmacia(); // para evitar repeticiones en futuras versiones
}

function mostrarConsultas() {
  const tabla = document.getElementById('tablaConsulta');
  tabla.innerHTML = '';
  consultas.forEach((c, i) => {
    tabla.innerHTML += `<tr>
      <td>${c.nombre}</td>
      <td>${c.dni}</td>
      <td>${c.motivo}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editarConsulta(${i})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="confirmarEliminarConsulta(${i}, '${c.nombre}')">Eliminar</button>
      </td>
    </tr>`;
  });
}

function mostrarFarmacia() {
  const tabla = document.getElementById('tablaFarmacia');
  tabla.innerHTML = '';
  farmacia.forEach((f, i) => {
    tabla.innerHTML += `<tr>
      <td>${f.nombre}</td>
      <td>${f.dni}</td>
      <td>${f.medicamento}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editarFarmacia(${i})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="confirmarEliminarFarmacia(${i}, '${f.nombre}')">Eliminar</button>
      </td>
    </tr>`;
  });
}

// --- FUNCIONES DE CONFIRMACIÓN DE ELIMINACIÓN ---
function confirmarEliminarConsulta(index, nombre) {
    if (confirm(`¿Estás seguro de eliminar la consulta de ${nombre}?`)) {
        eliminarConsulta(index);
    }
}

function confirmarEliminarFarmacia(index, nombre) {
    if (confirm(`¿Estás seguro de eliminar la entrega de medicamento a ${nombre}?`)) {
        eliminarFarmacia(index);
    }
}
// ------------------------------------------------

function eliminarConsulta(index) {
  consultas.splice(index, 1);
  mostrarConsultas();
  actualizarListaPacientesFarmacia();
}

function eliminarFarmacia(index) {
  farmacia.splice(index, 1);
  mostrarFarmacia();
}

// --- FUNCIONES DE EDICIÓN ---
function editarConsulta(index) {
    const nuevaNombre = prompt("Editar Nombre:", consultas[index].nombre);
    if (nuevaNombre === null) return; // Si el usuario cancela

    const nuevoDni = prompt("Editar DNI:", consultas[index].dni);
    if (nuevoDni === null) return;

    const nuevoMotivo = prompt("Editar Motivo de Consulta:", consultas[index].motivo);
    if (nuevoMotivo === null) return;

    // Validación simplificada para la edición
    if (!validarCampos(nuevaNombre.trim(), nuevoDni.trim(), nuevoMotivo.trim())) {
        return;
    }

    consultas[index].nombre = nuevaNombre.trim();
    consultas[index].dni = nuevoDni.trim();
    consultas[index].motivo = nuevoMotivo.trim();

    mostrarConsultas();
    actualizarListaPacientesFarmacia();
}

function editarFarmacia(index) {
    // Para simplificar, solo permitimos editar el medicamento y no el paciente (nombre/dni)
    const nuevoMedicamento = prompt("Editar Medicamento:", farmacia[index].medicamento);
    if (nuevoMedicamento === null) return;

    if (nuevoMedicamento.trim() === '') {
        alert("El medicamento no puede estar vacío.");
        return;
    }

    farmacia[index].medicamento = nuevoMedicamento.trim();
    mostrarFarmacia();
}
// ----------------------------


function validarCampos(nombre, dni, campoExtra) {
  if (nombre === '' || dni === '' || campoExtra === '') {
    alert("Todos los campos son obligatorios.");
    return false;
  }
  if (dni.length !== 8 || isNaN(dni)) {
    alert("DNI inválido. Debe tener 8 dígitos numéricos.");
    return false;
  }
  return true;
}

function limpiarCampos(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el.tagName === 'SELECT') {
      el.selectedIndex = 0;
    } else {
      el.value = '';
    }
  });
}

// Actualiza el SELECT con los nombres de los pacientes registrados
function actualizarListaPacientesFarmacia() {
  const select = document.getElementById('nombreFarmacia');
  select.innerHTML = '<option value="">Seleccione un paciente</option>';
  // Utilizamos un Set para asegurar nombres únicos en la lista desplegable
  const nombresUnicos = [...new Set(consultas.map(c => c.nombre))];

  nombresUnicos.forEach(nombre => {
    const option = document.createElement('option');
    option.value = nombre;
    option.textContent = nombre;
    select.appendChild(option);
  });
}

// Al seleccionar paciente, completar automáticamente su DNI
function actualizarDniFarmacia() {
  const nombreSeleccionado = document.getElementById('nombreFarmacia').value;
  // Buscamos el paciente en el registro de consultas (asumiendo que tiene el DNI correcto allí)
  const paciente = consultas.find(c => c.nombre === nombreSeleccionado);
  document.getElementById('dniFarmacia').value = paciente ? paciente.dni : '';
}

// Inicializar tablas
mostrarConsultas();
mostrarFarmacia();