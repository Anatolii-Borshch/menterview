import referenceApi from '../../api/referenceApi';
import adminReferenceApi from '../../api/adminReferenceApi';
import type { TableKey, TableItem, TableState } from './AdminReferenceTypes';

export const makeInitialTableState = (): TableState => ({
  items: [],
  loading: false,
  newName: '',
  editingId: null,
  editingName: '',
  saving: false,
});

export const fetchItems = async (table: TableKey): Promise<TableItem[]> => {
  switch (table) {
    case 'categories': {
      const res = await referenceApi.getCategories();
      return res.data.data.map((item) => ({ id: item.categoryId, name: item.categoryName }));
    }

    case 'difficulties': {
      const res = await referenceApi.getDifficulties();
      return res.data.data.map((item) => ({ id: item.difficultyId, name: item.difficultyName }));
    }

    case 'levels': {
      const res = await referenceApi.getLevels();
      return res.data.data.map((item) => ({ id: item.levelId, name: item.levelName }));
    }

    case 'tags': {
      const res = await referenceApi.getTags();
      return res.data.data.map((item) => ({ id: item.tagId, name: item.tagName }));
    }

    case 'countries': {
      const res = await referenceApi.getCountries();
      return res.data.data.map((item) => ({ id: item.countryId, name: item.countryName }));
    }

    case 'languages': {
      const res = await referenceApi.getLanguages();
      return res.data.data.map((item) => ({ id: item.languageId, name: item.languageName }));
    }

    case 'themes': {
      const res = await referenceApi.getThemes();
      return res.data.data.map((item) => ({ id: item.themeId, name: item.themeName }));
    }

    case 'roles': {
      const res = await referenceApi.getRoles();
      return res.data.data.map((item) => ({ id: item.roleId, name: item.roleName }));
    }
  }
};

export const createItem = async (table: TableKey, name: string): Promise<void> => {
  switch (table) {
    case 'categories':
      await adminReferenceApi.createCategory(name);
      break;

    case 'difficulties':
      await adminReferenceApi.createDifficulty(name);
      break;

    case 'levels':
      await adminReferenceApi.createLevel(name);
      break;

    case 'tags':
      await adminReferenceApi.createTag(name);
      break;

    case 'countries':
      await adminReferenceApi.createCountry(name);
      break;

    case 'languages':
      await adminReferenceApi.createLanguage(name);
      break;

    case 'themes':
      await adminReferenceApi.createTheme(name);
      break;

    case 'roles':
      await adminReferenceApi.createRole(name);
      break;
  }
};

export const updateItem = async (table: TableKey, id: number, name: string): Promise<void> => {
  switch (table) {
    case 'categories':
      await adminReferenceApi.updateCategory(id, name);
      break;

    case 'difficulties':
      await adminReferenceApi.updateDifficulty(id, name);
      break;

    case 'levels':
      await adminReferenceApi.updateLevel(id, name);
      break;

    case 'tags':
      await adminReferenceApi.updateTag(id, name);
      break;

    case 'countries':
      await adminReferenceApi.updateCountry(id, name);
      break;

    case 'languages':
      await adminReferenceApi.updateLanguage(id, name);
      break;

    case 'themes':
      await adminReferenceApi.updateTheme(id, name);
      break;

    case 'roles':
      await adminReferenceApi.updateRole(id, name);
      break;
  }
};

export const deleteItem = async (table: TableKey, id: number): Promise<void> => {
  switch (table) {
    case 'categories':
      await adminReferenceApi.deleteCategory(id);
      break;

    case 'difficulties':
      await adminReferenceApi.deleteDifficulty(id);
      break;

    case 'levels':
      await adminReferenceApi.deleteLevel(id);
      break;

    case 'tags':
      await adminReferenceApi.deleteTag(id);
      break;

    case 'countries':
      await adminReferenceApi.deleteCountry(id);
      break;

    case 'languages':
      await adminReferenceApi.deleteLanguage(id);
      break;

    case 'themes':
      await adminReferenceApi.deleteTheme(id);
      break;

    case 'roles':
      await adminReferenceApi.deleteRole(id);
      break;
  }
};
