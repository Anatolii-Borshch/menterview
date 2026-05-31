import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import AdminPanelLayout from '../../components/admin/AdminPanelLayout';
import { confirmToast } from '../../components/common/confirmToast';
import referenceApi from '../../api/referenceApi';
import adminReferenceApi from '../../api/adminReferenceApi';

type TableKey =
  | 'categories'
  | 'difficulties'
  | 'levels'
  | 'tags'
  | 'countries'
  | 'languages'
  | 'themes'
  | 'roles';

interface TableItem {
  id: number;
  name: string;
}

interface TableState {
  items: TableItem[];
  loading: boolean;
  newName: string;
  editingId: number | null;
  editingName: string;
  saving: boolean;
}

const TABLE_LABELS: Record<TableKey, string> = {
  categories: 'Categories',
  difficulties: 'Difficulties',
  levels: 'Levels',
  tags: 'Tags',
  countries: 'Countries',
  languages: 'Languages',
  themes: 'Themes',
  roles: 'Roles',
};

const ALL_TABLES: TableKey[] = [
  'categories',
  'difficulties',
  'levels',
  'tags',
  'countries',
  'languages',
  'themes',
  'roles',
];

function makeInitialState(): TableState {
  return {
    items: [],
    loading: false,
    newName: '',
    editingId: null,
    editingName: '',
    saving: false,
  };
}

async function fetchItems(table: TableKey): Promise<TableItem[]> {
  switch (table) {
    case 'categories': {
      const res = await referenceApi.getCategories();
      return res.data.data.map((c) => ({ id: c.categoryId, name: c.categoryName }));
    }
    case 'difficulties': {
      const res = await referenceApi.getDifficulties();
      return res.data.data.map((d) => ({ id: d.difficultyId, name: d.difficultyName }));
    }
    case 'levels': {
      const res = await referenceApi.getLevels();
      return res.data.data.map((l) => ({ id: l.levelId, name: l.levelName }));
    }
    case 'tags': {
      const res = await referenceApi.getTags();
      return res.data.data.map((t) => ({ id: t.tagId, name: t.tagName }));
    }
    case 'countries': {
      const res = await referenceApi.getCountries();
      return res.data.data.map((c) => ({ id: c.countryId, name: c.countryName }));
    }
    case 'languages': {
      const res = await referenceApi.getLanguages();
      return res.data.data.map((l) => ({ id: l.languageId, name: l.languageName }));
    }
    case 'themes': {
      const res = await referenceApi.getThemes();
      return res.data.data.map((t) => ({ id: t.themeId, name: t.themeName }));
    }
    case 'roles': {
      const res = await referenceApi.getRoles();
      return res.data.data.map((r) => ({ id: r.roleId, name: r.roleName }));
    }
  }
}

async function createItem(table: TableKey, name: string): Promise<void> {
  switch (table) {
    case 'categories': await adminReferenceApi.createCategory(name); break;
    case 'difficulties': await adminReferenceApi.createDifficulty(name); break;
    case 'levels': await adminReferenceApi.createLevel(name); break;
    case 'tags': await adminReferenceApi.createTag(name); break;
    case 'countries': await adminReferenceApi.createCountry(name); break;
    case 'languages': await adminReferenceApi.createLanguage(name); break;
    case 'themes': await adminReferenceApi.createTheme(name); break;
    case 'roles': await adminReferenceApi.createRole(name); break;
  }
}

async function updateItem(table: TableKey, id: number, name: string): Promise<void> {
  switch (table) {
    case 'categories': await adminReferenceApi.updateCategory(id, name); break;
    case 'difficulties': await adminReferenceApi.updateDifficulty(id, name); break;
    case 'levels': await adminReferenceApi.updateLevel(id, name); break;
    case 'tags': await adminReferenceApi.updateTag(id, name); break;
    case 'countries': await adminReferenceApi.updateCountry(id, name); break;
    case 'languages': await adminReferenceApi.updateLanguage(id, name); break;
    case 'themes': await adminReferenceApi.updateTheme(id, name); break;
    case 'roles': await adminReferenceApi.updateRole(id, name); break;
  }
}

async function deleteItem(table: TableKey, id: number): Promise<void> {
  switch (table) {
    case 'categories': await adminReferenceApi.deleteCategory(id); break;
    case 'difficulties': await adminReferenceApi.deleteDifficulty(id); break;
    case 'levels': await adminReferenceApi.deleteLevel(id); break;
    case 'tags': await adminReferenceApi.deleteTag(id); break;
    case 'countries': await adminReferenceApi.deleteCountry(id); break;
    case 'languages': await adminReferenceApi.deleteLanguage(id); break;
    case 'themes': await adminReferenceApi.deleteTheme(id); break;
    case 'roles': await adminReferenceApi.deleteRole(id); break;
  }
}

export default function AdminReferencePage() {
  const [activeTable, setActiveTable] = useState<TableKey>('categories');
  const [tables, setTables] = useState<Record<TableKey, TableState>>(
    () => Object.fromEntries(ALL_TABLES.map((k) => [k, makeInitialState()])) as Record<TableKey, TableState>
  );

  const setTable = useCallback(
    (key: TableKey, patch: Partial<TableState> | ((prev: TableState) => Partial<TableState>)) => {
      setTables((prev) => {
        const current = prev[key];
        const updates = typeof patch === 'function' ? patch(current) : patch;
        return { ...prev, [key]: { ...current, ...updates } };
      });
    },
    []
  );

  const load = useCallback(
    async (table: TableKey) => {
      setTable(table, { loading: true });
      try {
        const items = await fetchItems(table);
        setTable(table, { items, loading: false });
      } catch {
        toast.error(`Failed to load ${TABLE_LABELS[table]}.`);
        setTable(table, { loading: false });
      }
    },
    [setTable]
  );

  useEffect(() => {
    queueMicrotask(() => {
      void load(activeTable);
    });
  }, [activeTable, load]);

  const state = tables[activeTable];
  const isEmpty = !state.loading && state.items.length === 0;
  let tableContent: React.ReactNode;

  if (state.loading) {
    tableContent = (
      <div className="space-y-2">
        {['skeleton-1', 'skeleton-2', 'skeleton-3', 'skeleton-4', 'skeleton-5', 'skeleton-6'].map((key) => (
          <div key={key} className="bg-snow border border-periwinkle rounded-xl h-11 animate-pulse" />
        ))}
      </div>
    );
  } else if (isEmpty) {
    tableContent = <p className="text-sm text-navy/40 text-center py-8">No items yet.</p>;
  } else {
    tableContent = (
      <ul className="space-y-2">
        {state.items.map((item) =>
          state.editingId === item.id ? (
            <li key={item.id} className="flex items-center gap-2">
              <input
                type="text"
                value={state.editingName}
                onChange={(e) => setTable(activeTable, { editingName: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
                className="flex-1 border border-cornflower rounded-lg px-3 py-2 text-sm text-navy focus:outline-none"
                disabled={state.saving}
              />
              <button
                onClick={handleSaveEdit}
                disabled={state.saving || !state.editingName.trim()}
                className="text-sm text-white bg-cornflower px-3 py-2 rounded-lg hover:bg-cornflower/90 disabled:opacity-50 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-sm text-navy/50 px-3 py-2 rounded-lg hover:text-navy hover:bg-periwinkle/30 transition-colors"
              >
                Cancel
              </button>
            </li>
          ) : (
            <li
              key={item.id}
              className="flex items-center justify-between border border-periwinkle rounded-xl px-4 py-2.5 hover:border-cornflower/40 transition-colors group"
            >
              <span className="text-sm text-navy">{item.name}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleStartEdit(item)}
                  title="Edit"
                  className="p-1.5 rounded-lg text-navy/40 hover:text-cornflower hover:bg-cornflower/10 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a4 4 0 01-1.414.94l-3.414 1.137 1.137-3.414A4 4 0 019 13z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  title="Delete"
                  className="p-1.5 rounded-lg text-navy/40 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </li>
          )
        )}
      </ul>
    );
  }

  const handleCreate = async () => {
    const name = state.newName.trim();
    if (!name) return;
    setTable(activeTable, { saving: true });
    try {
      await createItem(activeTable, name);
      setTable(activeTable, { newName: '', saving: false });
      await load(activeTable);
      toast.success('Created.');
    } catch {
      toast.error('Failed to create.');
      setTable(activeTable, { saving: false });
    }
  };

  const handleStartEdit = (item: TableItem) => {
    setTable(activeTable, { editingId: item.id, editingName: item.name });
  };

  const handleCancelEdit = () => {
    setTable(activeTable, { editingId: null, editingName: '' });
  };

  const handleSaveEdit = async () => {
    const name = state.editingName.trim();
    if (!name || state.editingId === null) return;
    setTable(activeTable, { saving: true });
    try {
      await updateItem(activeTable, state.editingId, name);
      setTable(activeTable, { editingId: null, editingName: '', saving: false });
      await load(activeTable);
      toast.success('Updated.');
    } catch {
      toast.error('Failed to update.');
      setTable(activeTable, { saving: false });
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const confirmed = await confirmToast(`Delete "${name}"? This may affect existing questions.`, {
      title: 'Confirm deletion',
      confirmText: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await deleteItem(activeTable, id);
      await load(activeTable);
      toast.success('Deleted.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <AdminPanelLayout
      title="Entities"
      subtitle="Create, update, and delete reference entities used across interviews and profiles."
    >

        <div className="flex gap-6">
          <nav className="w-44 shrink-0">
            <ul className="space-y-1">
              {ALL_TABLES.map((key) => (
                <li key={key}>
                  <button
                    onClick={() => setActiveTable(key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTable === key
                        ? 'bg-cornflower/10 text-cornflower'
                        : 'text-navy/60 hover:text-navy hover:bg-periwinkle/30'
                    }`}
                  >
                    {TABLE_LABELS[key]}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex-1 bg-white border border-periwinkle rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-navy mb-4">{TABLE_LABELS[activeTable]}</h2>

            <div className="flex gap-2 mb-5">
              <input
                type="text"
                placeholder={`New ${TABLE_LABELS[activeTable].toLowerCase().replace(/s$/, '')} name…`}
                value={state.newName}
                onChange={(e) => setTable(activeTable, { newName: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                className="flex-1 border border-periwinkle rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:border-cornflower"
                disabled={state.saving}
              />
              <button
                onClick={handleCreate}
                disabled={state.saving || !state.newName.trim()}
                className="bg-cornflower text-white text-sm px-4 py-2 rounded-lg hover:bg-cornflower/90 disabled:opacity-50 transition-colors"
              >
                Add
              </button>
            </div>

            {tableContent}
          </div>
        </div>
    </AdminPanelLayout>
  );
}
