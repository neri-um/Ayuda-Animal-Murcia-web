Tabla 4. Casos de uso del usuario no autenticado
Identificador	Nombre	Descripción
CU-01	Ver listado de animales	El usuario accede a la página principal y visualiza el listado de animales disponibles en la protectora.
CU-02	Buscar/filtrar animales	El usuario aplica filtros (especie, tamaño, edad, etc.) para acotar los resultados del listado.
CU-03	Ver ficha de un animal	El usuario selecciona un animal del listado y accede a su ficha detallada con toda su información.
CU-04	Rellenar cuestionario de adopción	El usuario rellena un cuestionario específico según la especie del animal en el que está interesado.
CU-05	Iniciar sesión	El usuario inicia sesión en el sistema.
El voluntario es un usuario autenticado perteneciente a la protectora. Además de los casos de uso heredados (CU-01 a CU-05), tiene acceso a la gestión de los animales a su cargo y a las funcionalidades básicas del almacén, tal como se recoge en la Tabla 5.
Tabla 5. Casos de uso del usuario voluntario
Identificador	Nombre	Descripción
CU-06	Cerrar sesión	El voluntario cierra su sesión en el sistema.
CU-07	Añadir animal	El voluntario registra un nuevo animal en el sistema con toda su información.
CU-08	Editar animal	El voluntario modifica los datos de un animal que tiene a su cargo.
CU-09	Eliminar animal	El voluntario elimina del sistema un animal que tiene a su cargo.
CU-10	Cambiar estado de un animal	El voluntario actualiza el estado de un animal a su cargo (disponible, en acogida, adoptado...).
CU-11	Añadir cita veterinaria	El voluntario registra una cita veterinaria asociada a un animal concreto.
CU-12	Ver citas veterinarias	El voluntario consulta el historial de citas veterinarias de un animal.
CU-13	Ver almacén	El voluntario consulta el contenido del almacén en modo solo lectura.
CU-14	Solicitar producto del almacén	El voluntario registra una solicitud de necesidad de un producto del almacén para que el encargado la gestione.
CU-15	Ver estado de mis solicitudes	El voluntario consulta el estado (pendiente, aceptada o rechazada) de las solicitudes que ha realizado.
CU-16	Notificar devolución de producto	El voluntario notifica a través de la aplicación que va a devolver un producto del almacén.
El encargado es un voluntario con permisos adicionales sobre el almacén. Hereda todos los casos de uso del voluntario (CU-01 a CU-16) y puede además gestionar el inventario y las solicitudes recibidas, como se muestra en la Tabla 6.
Tabla 6. Casos de uso del usuario encargado
Identificador	Nombre	Descripción
CU-17	Añadir producto al almacén	El encargado registra un nuevo producto en el almacén.
CU-18	Editar producto del almacén	El encargado modifica la información o cantidad de un producto existente.
CU-19	Eliminar producto del almacén	El encargado elimina un producto del almacén.
CU-20	Gestionar solicitud de producto	El encargado acepta o rechaza una solicitud de producto realizada por un voluntario.
CU-21	Ver asignación de productos	El encargado consulta qué voluntario tiene asignado cada producto del almacén.
CU-22	Confirmar devolución de producto	El encargado confirma que el voluntario ha devuelto físicamente el producto, actualizando su disponibilidad.
Por último, el administrador tiene control total sobre el sistema. Con acceso a todos los casos de uso anteriores (CU-01 a CU-22), es la única con capacidad para gestionar las cuentas de usuario, detallado en la Tabla 7.
Tabla 7. Casos de uso del administrador
Identificador	Nombre	Descripción
CU-23	Crear cuenta de usuario	El administrador crea cuentas nuevas para voluntarios o encargados.
CU-24	Editar cuenta de usuario	El administrador modifica los datos o el rol de un usuario existente.
CU-25	Eliminar cuenta de usuario	El administrador desactiva la cuenta de un usuario para que no pueda acceder al sistema.
