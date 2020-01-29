export const FORM_LOAD = 'form/LOAD';
export const FORM_SAVE = 'form/SAVE';
export const FIELDS_RESET_FIELDS = 'form/FIELDS_RESET_FIELDS';
export const FIELDS_SET_FIELD = 'form/FIELDS_SET_FIELD';

export const resetFields = path => ({
  type: FIELDS_RESET_FIELDS,
  payload: { path },
});

export const setField = (path, value) => ({
  type: FIELDS_SET_FIELD,
  payload: { path, value },
});