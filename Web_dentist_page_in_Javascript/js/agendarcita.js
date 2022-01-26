/*
 * Pagina de agendar cita
 */

// CREAR OBJETO DE CONECCION.
const db = firebase.firestore();

//CREACION DE OBJETOS
const form = document.querySelector("#form");
const contenedor = document.querySelector("#tblDatos > tbody");

const coleccion = "cita";
let editStatus = false;
let idSeccionado = "";

// CONSTANTES DEL MENSAJE
const guardarMessage = {
  style: {
    main: {
      background: "#d4edda",
      color: "#155724",
      "box-shadow": "none",
    },
  },
};

const deleteMessage = {
  style: {
    main: {
      background: "#f8d7da",
      color: "#721c24",
      "box-shadow": "none",
    },
  },
};

//METODOS DEL CRUD
const guardarCita = (
  nombre,
  apellido,
  correo,
  numero,
  fecha,
  hora,
  servicio,
  especialista
) => {
  db.collection(coleccion).doc().set({
    nombre,
    apellido,
    correo,
    numero,
    fecha,
    hora,
    servicio,
    especialista,
  });
};

const findAll = () => db.collection(coleccion).get();

const findById = (id) => db.collection(coleccion).doc(id).get();

const onFindAll = (callback) => db.collection(coleccion).onSnapshot(callback);

const onDelete = (id) => db.collection(coleccion).doc(id).delete();

const onUpdate = (id, cita) => db.collection(coleccion).doc(id).update(cita);

//EVENTO ONLOAD
window.addEventListener("load", async (e) => {
  onFindAll((query) => {
    contenedor.innerHTML = "";

    query.forEach((doc) => {
      var dato = doc.data();
      contenedor.innerHTML += `<tr>
                                        <td>${dato.nombre}</td>
                                        <td>${dato.apellido}</td>
                                        <td>${dato.correo}</td>
                                        <td>${dato.numero}</td>
                                        <td>${dato.fecha}</td>
                                        <td>${dato.hora}</td>
                                        <td>${dato.servicio}</td>
                                        <td>${dato.especialista}</td>
                                        <td><button class="btn btn-primary btn-modificar" data-id="${doc.id}">Modificar</button></td>
                                        <td><button class="btn btn-warning btn-borrar" data-id="${doc.id}">Borrar</button></td>
                                    </tr>`;
    });

    const btnBorrar = contenedor.querySelectorAll(".btn-borrar");

    btnBorrar.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          if (window.confirm("Desea borrar el registro?")) {
            await onDelete(e.target.dataset.id);
            iqwerty.toast.toast("Datos Eliminados!", deleteMessage);
          }
        } catch (error) {
          console.log(">>> Error al borrar. " + error);
        }
      });
    });

    const btnModificar = contenedor.querySelectorAll(".btn-modificar");

    btnModificar.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await findById(e.target.dataset.id);
          const cita = doc.data();

          form.txtNombre.value = cita.nombre;
          form.txtApellido.value = cita.apellido;
          form.txtCorreo.value = cita.correo;
          form.txtNumero.value = cita.numero;
          form.txtFecha.value = cita.fecha;
          form.txtHora.value = cita.hora;
          form.cmbServicio.value = cita.servicio;
          form.cmbEspecialista.value = cita.especialista;

          form.btnGuardar.innerText = "Modificar";

          editStatus = true;
          idSeccionado = doc.id;
        } catch (error) {
          console.log(">>> Error al modificar. " + error);
        }
      });
    });
  });
});

//EVENTO SUBMIT
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  var nombre = form.txtNombre;
  var apellido = form.txtApellido;
  var correo = form.txtCorreo;
  var numero = form.txtNumero;
  var fecha = form.txtFecha;
  var hora = form.txtHora;
  var servicio = form.cmbServicio;
  var especialista = form.cmbEspecialista;

  try {
    if (!editStatus) {
      await guardarCita(
        nombre.value,
        apellido.value,
        correo.value,
        numero.value,
        fecha.value,
        hora.value,
        servicio.value,
        especialista.value
      );
      iqwerty.toast.toast("Datos Almacenados correctamente!", guardarMessage);
    } else {
      console.log(idSeccionado);
      await onUpdate(idSeccionado, {
        nombre: nombre.value,
        apellido: apellido.value,
        correo: correo.value,
        numero: numero.value,
        fecha: fecha.value,
        hora: hora.value,
        servicio: servicio.value,
        especialista: especialista.value,
      });

      editStatus = false;
      idSeccionado = "";
      form.btnGuardar.innerText = "Guardar";

      iqwerty.toast.toast("Datos Modificados correctamente!", guardarMessage);
    }
    form.reset();
    nombre.focus();
  } catch (error) {
    console.log(">>> Error. " + error);
  }
});
