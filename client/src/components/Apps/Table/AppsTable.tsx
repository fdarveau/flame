import { Fragment, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { App, Category } from '../../../interfaces';
import { actionCreators } from '../../../store';
import { State } from '../../../store/reducers';
import { appTemplate } from '../../../utility';
import { TableActions } from '../../Actions/TableActions';
import { Message, Table } from '../../UI';

// Redux
// Typescript
// UI
interface Props {
  openFormForUpdating: (data: Category | App) => void;
}

export const AppsTable = ({ openFormForUpdating }: Props): JSX.Element => {
  const categoryInEdit = useSelector((state: State) => state.apps.categoryInEdit);
  const config = useSelector((state: State) => state.config.config);

  const dispatch = useDispatch();
  const {
    deleteApp,
    updateApp,
    createNotification,
    reorderApps,
  } = bindActionCreators(actionCreators, dispatch);

  const [localApps, setLocalApps] = useState<App[]>([]);

  // Copy apps array
  useEffect(() => {
    if (categoryInEdit) {
      setLocalApps([...categoryInEdit.apps]);
    }
  }, [categoryInEdit]);

  // Drag and drop handler
  const dragEndHandler = (result: DropResult): void => {
    if (config.useOrdering !== 'orderId') {
      createNotification({
        title: 'Error',
        message: 'Custom order is disabled',
      });
      return;
    }

    if (!result.destination) {
      return;
    }

    const tmpApps = [...localApps];
    const [movedApp] = tmpApps.splice(result.source.index, 1);
    tmpApps.splice(result.destination.index, 0, movedApp);

    setLocalApps(tmpApps);

    const categoryId = categoryInEdit?.id || -1;
    reorderApps(tmpApps, categoryId);
  };

  // Action hanlders
  const deleteAppHandler = (id: number, name: string) => {
    const categoryId = categoryInEdit?.id || -1;

    const proceed = window.confirm(`Are you sure you want to delete ${name}?`);
    if (proceed) {
      deleteApp(id, categoryId);
    }
  };

  const updateAppHandler = (id: number) => {
    const app =
      categoryInEdit?.apps.find((b) => b.id === id) || appTemplate;

    openFormForUpdating(app);
  };

  const changeAppVisibiltyHandler = (id: number) => {
    const app =
      categoryInEdit?.apps.find((b) => b.id === id) || appTemplate;

    const categoryId = categoryInEdit?.id || -1;
    const [prev, curr] = [categoryId, categoryId];

    updateApp(
      id,
      { ...app, isPublic: !app.isPublic },
      { prev, curr }
    );
  };

  return (
    <Fragment>
      {!categoryInEdit ? (
        <Message isPrimary={false}>
          Switch to grid view and click on the name of category you want to edit
        </Message>
      ) : (
        <Message isPrimary={false}>
          Editing apps from&nbsp;<span>{categoryInEdit.name}</span>
          &nbsp;category
        </Message>
      )}

      {categoryInEdit && (
        <DragDropContext onDragEnd={dragEndHandler}>
          <Droppable droppableId="apps">
            {(provided) => (
              <Table
                headers={[
                  'Name',
                  'URL',
                  'Icon',
                  'Visibility',
                  'Category',
                  'Actions',
                ]}
                innerRef={provided.innerRef}
              >
                {localApps.map((app, index): JSX.Element => {
                  return (
                    <Draggable
                      key={app.id}
                      draggableId={app.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => {
                        const style = {
                          border: snapshot.isDragging
                            ? '1px solid var(--color-accent)'
                            : 'none',
                          borderRadius: '4px',
                          ...provided.draggableProps.style,
                        };

                        return (
                          <tr
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            style={style}
                          >
                            <td style={{ width: '200px' }}>{app.name}</td>
                            <td style={{ width: '200px' }}>{app.url}</td>
                            <td style={{ width: '200px' }}>{app.icon}</td>
                            <td style={{ width: '200px' }}>
                              {app.isPublic ? 'Visible' : 'Hidden'}
                            </td>
                            <td style={{ width: '200px' }}>
                              {categoryInEdit.name}
                            </td>

                            {!snapshot.isDragging && (
                              <TableActions
                                entity={app}
                                deleteHandler={deleteAppHandler}
                                updateHandler={updateAppHandler}
                                changeVisibilty={changeAppVisibiltyHandler}
                                showPin={false}
                              />
                            )}
                          </tr>
                        );
                      }}
                    </Draggable>
                  );
                })}
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Fragment>
  );
};
