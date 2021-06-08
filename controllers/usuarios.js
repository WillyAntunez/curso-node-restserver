const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
	// const { q, nombre = 'No name', apikey, page = '1', limit } = req.query;
	const { limite = 5, desde = 0 } = req.query;
	const query = { estado: true };

	const [total, usuarios] = await Promise.all([
		Usuario.countDocuments(query),
		Usuario.find(query).limit(Number(limite)).skip(Number(desde)),
	]);

	res.json({
		total,
		usuarios,
	});
};

const usuariosPost = async (req, res = response) => {
	const { nombre, correo, password, rol } = req.body;

	const usuario = new Usuario({
		nombre,
		correo,
		password,
		rol,
	});

	// Encriptar la contraseña
	const salt = bcryptjs.genSaltSync();
	usuario.password = bcryptjs.hashSync(password, salt);

	// Guardar en DB
	await usuario.save();

	res.json(usuario);
};

const usuariosPut = async (req, res) => {
	const id = req.params.id;
	const { _id, password, google, correo, ...resto } = req.body;

	if (password) {
		const salt = bcryptjs.genSaltSync();
		resto.password = bcryptjs.hashSync(password, salt);
	}

	const usuario = await Usuario.findByIdAndUpdate(id, resto);

	res.json({
		usuario,
	});
};

const usuariosPatch = (req, res) => {
	res.json({
		msj: 'patch API - controlador',
	});
};

const usuariosDelete = async (req, res) => {
	const { id } = req.params;

	// fisicamente lo borramos
	// const usuario = await Usuario.findByIdAndDelete(id);

	const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

	res.json({
		usuario,
	});
};

module.exports = {
	usuariosGet,
	usuariosPost,
	usuariosPut,
	usuariosPatch,
	usuariosDelete,
};
