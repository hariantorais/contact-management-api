const contactRepo = require("../repositories/contact-repository");
const {
  validate,
  createContactValidation,
  updateContactValidation,
} = require("../utils/validation");

const create = async (user, request) => {
  // 1. validasi input
  const contactRequest = validate(createContactValidation, request);

  // 2. tambahkan user_id dari user yang sedang login
  contactRequest.userId = user.id;

  // 3. simpan ke database
  return contactRepo.create(contactRequest);
};

const list = async (user) => {
  // hanya ambl kontak milik user yang sedang login
  return contactRepo.findByUser(user.id);
};

const update = async (user, contactId, request) => {
  const contactRequest = validate(updateContactValidation, request);

  const oldData = await contactRepo.findById(contactId);

  // 1. cek apakah data benar-benar ada di DB
  if (!oldData) {
    const error = new Error("Kontak tidak ditemukan!");
    error.status = 404; // not found
    throw error;
  }

  // 2. cek apakah userId di kontak sama dengan ID user yang login
  if (oldData.userId !== user.id) {
    const error = new Error("Anda tidak memiliki akses ke kontak ini");
    error.status = 403; // forbidden
    throw error;
  }

  const finalData = {
    ...oldData,
    ...contactRequest,
  };

  return contactRepo.update(contactId, finalData);
};

const remove = async (user, contactId) => {
  const existingContact = await contactRepo.findByUser(contactId);
  if (!existingContact) {
    throw new Error("Kontak tidak ditemukan atau akses ditolak");
  }

  return contactRepo.delete(contactId);
};

const search = async (user, request) => {
  // request berisi params
  return contactRepo.search(user.id, request);
};

module.exports = {
  create,
  list,
  update,
  remove,
  search,
};
