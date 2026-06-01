import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminPanelLayout from '../../components/admin/AdminPanelLayout';
import { confirmToast } from '../../components/common/confirmToast';
import { ALL_TABLES, TABLE_LABELS, ADMIN_REFERENCE_TEXT } from './AdminReferenceConstants';
import { createItem, deleteItem, fetchItems, makeInitialTableState, updateItem } from './AdminReferenceHelpers';
import type { TableKey, TableState } from './AdminReferenceTypes';

export default function AdminReferencePage() {
  const [activeTable, setActiveTable] = useState<TableKey>('categories');
  const [tables, setTables] = useState<Record<TableKey, TableState>>(() =>
    Object.fromEntries(ALL_TABLES.map((tableKey) => [tableKey, makeInitialTableState()])) as Record<TableKey, TableState>
  );

  const setTable = useCallback((key: TableKey, patch: Partial<TableState> | ((prev: TableState) => Partial<TableState>)) => {
    setTables((prev) => {
      const current = prev[key];
      const updates = typeof patch === 'function' ? patch(current) : patch;
      return { ...prev, [key]: { ...current, ...updates } };
    });
  }, []);

  const load = useCallback(
    async (table: TableKey) => {
      setTable(table, { loading: true });
      try {
        const items = await fetchItems(table);
        setTable(table, { items, loading: false });
      } catch {
        toast.error(ADMIN_REFERENCE_TEXT.FAILED_TO_LOAD(TABLE_LABELS[table]));
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

  const handleCreate = async () => {
    const name = state.newName.trim();
    if (!name) {
      return;
    }

    setTable(activeTable, { saving: true });
    try {
      await createItem(activeTable, name);
      setTable(activeTable, { newName: '', saving: false });
      await load(activeTable);
      toast.success(ADMIN_REFERENCE_TEXT.CREATED);
    } catch {
      toast.error(ADMIN_REFERENCE_TEXT.FAILED_TO_CREATE);
      setTable(activeTable, { saving: false });
    }
  };

  const handleStartEdit = (itemId: number, itemName: string) => {
    setTable(activeTable, { editingId: itemId, editingName: itemName });
  };

  const handleCancelEdit = () => {
    setTable(activeTable, { editingId: null, editingName: '' });
  };

  const handleSaveEdit = async () => {
    const name = state.editingName.trim();
    if (!name || state.editingId === null) {
      return;
    }

    setTable(activeTable, { saving: true });
    try {
      await updateItem(activeTable, state.editingId, name);
      setTable(activeTable, { editingId: null, editingName: '', saving: false });
      await load(activeTable);
      toast.success(ADMIN_REFERENCE_TEXT.UPDATED);
    } catch {
      toast.error(ADMIN_REFERENCE_TEXT.FAILED_TO_UPDATE);
      setTable(activeTable, { saving: false });
    }
  };

  const handleDelete = async (itemId: number, itemName: string) => {
    const confirmed = await confirmToast(ADMIN_REFERENCE_TEXT.DELETE_CONFIRM_MESSAGE(itemName), {
      title: ADMIN_REFERENCE_TEXT.DELETE_CONFIRM_TITLE,
      confirmText: ADMIN_REFERENCE_TEXT.DELETE_CONFIRM_BUTTON,
      danger: true,
    });

    if (!confirmed) {
      return;
    }

    try {
      await deleteItem(activeTable, itemId);
      await load(activeTable);
      toast.success(ADMIN_REFERENCE_TEXT.DELETED);
    } catch {
      toast.error(ADMIN_REFERENCE_TEXT.FAILED_TO_DELETE);
    }
  };

  let tableContent: React.ReactNode;

  if (state.loading) {
    tableContent = (
      <div className="space-y-2">
        {['skeleton-1', 'skeleton-2', 'skeleton-3', 'skeleton-4', 'skeleton-5', 'skeleton-6'].map((key) => (
          <div key={key} className="h-11 rounded-xl border border-periwinkle bg-snow animate-pulse" />
        ))}
      </div>
    );
  } else if (isEmpty) {
    tableContent = <p className="py-8 text-center text-sm text-navy/40">{ADMIN_REFERENCE_TEXT.NO_ITEMS}</p>;
  } else {
    tableContent = (
      <ul className="space-y-2">
        {state.items.map((item) =>
          state.editingId === item.id ? (
            <li key={item.id} className="flex items-center gap-2">
              <input
                type="text"
                value={state.editingName}
                onChange={(event) => setTable(activeTable, { editingName: event.target.value })}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void handleSaveEdit();
                  }

                  if (event.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
                autoFocus
                className="flex-1 rounded-lg border border-cornflower px-3 py-2 text-sm text-navy focus:outline-none"
                disabled={state.saving}
              />
              <button
                onClick={() => void handleSaveEdit()}
                disabled={state.saving || !state.editingName.trim()}
                className="rounded-lg bg-cornflower px-3 py-2 text-sm text-white transition-colors hover:bg-cornflower/90 disabled:opacity-50"
              >
                {ADMIN_REFERENCE_TEXT.SAVE_BUTTON}
              </button>
              <button
                onClick={handleCancelEdit}
                className="rounded-lg px-3 py-2 text-sm text-navy/50 transition-colors hover:bg-periwinkle/30 hover:text-navy"
              >
                {ADMIN_REFERENCE_TEXT.CANCEL_BUTTON}
              </button>
            </li>
          ) : (
            <li
              key={item.id}
              className="group flex items-center justify-between rounded-xl border border-periwinkle px-4 py-2.5 transition-colors hover:border-cornflower/40"
            >
              <span className="text-sm text-navy">{item.name}</span>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleStartEdit(item.id, item.name)}
                  title="Edit"
                  className="rounded-lg p-1.5 text-navy/40 transition-colors hover:bg-cornflower/10 hover:text-cornflower"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a4 4 0 01-1.414.94l-3.414 1.137 1.137-3.414A4 4 0 019 13z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  title="Delete"
                  className="rounded-lg p-1.5 text-navy/40 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </li>
          )
        )}
      </ul>
    );
  }

  return (
    <AdminPanelLayout
      title={ADMIN_REFERENCE_TEXT.TITLE}
      subtitle={ADMIN_REFERENCE_TEXT.SUBTITLE}
    >
      <div className="flex gap-6">
        <nav className="w-44 shrink-0">
          <ul className="space-y-1">
            {ALL_TABLES.map((tableKey) => (
              <li key={tableKey}>
                <button
                  onClick={() => setActiveTable(tableKey)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                    activeTable === tableKey
                      ? 'bg-cornflower/10 text-cornflower'
                      : 'text-navy/60 hover:bg-periwinkle/30 hover:text-navy'
                  }`}
                >
                  {TABLE_LABELS[tableKey]}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1 rounded-2xl border border-periwinkle bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-navy">{TABLE_LABELS[activeTable]}</h2>

          <div className="mb-5 flex gap-2">
            <input
              type="text"
              placeholder={ADMIN_REFERENCE_TEXT.NEW_PLACEHOLDER(TABLE_LABELS[activeTable])}
              value={state.newName}
              onChange={(event) => setTable(activeTable, { newName: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void handleCreate();
                }
              }}
              className="flex-1 rounded-lg border border-periwinkle px-3 py-2 text-sm text-navy focus:border-cornflower focus:outline-none"
              disabled={state.saving}
            />
            <button
              onClick={() => void handleCreate()}
              disabled={state.saving || !state.newName.trim()}
              className="rounded-lg bg-cornflower px-4 py-2 text-sm text-white transition-colors hover:bg-cornflower/90 disabled:opacity-50"
            >
              {ADMIN_REFERENCE_TEXT.ADD_BUTTON}
            </button>
          </div>

          {tableContent}
        </div>
      </div>
    </AdminPanelLayout>
  );
}
