import { Fragment, KeyboardEvent, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { App, Category, NewNotification } from '../../../interfaces';
import {
  createNotification,
  deleteApp,
  deleteAppCategory,
  pinApp,
  pinAppCategory,
  reorderAppCategories,
  reorderApps,
  updateConfig,
} from '../../../store/actions';
import { searchConfig } from '../../../utility';
import Icon from '../../UI/Icons/Icon/Icon';
import Table from '../../UI/Table/Table';
import { ContentType } from '../Apps';
import classes from './AppTable.module.css';

interface ComponentProps {
  contentType: ContentType;
  categories: Category[];
  apps: App[];
  pinAppCategory: (category: Category) => void;
  deleteAppCategory: (id: number) => void;
  reorderAppCategories: (categories: Category[]) => void;
  updateHandler: (data: Category | App) => void;
  pinApp: (app: App) => void;
  deleteApp: (id: number) => void;
  reorderApps: (apps: App[]) => void;
  updateConfig: (formData: any) => void;
  createNotification: (notification: NewNotification) => void;
}

const AppTable = (props: ComponentProps): JSX.Element => {
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [localApps, setLocalApps] = useState<App[]>([]);
  const [isCustomOrder, setIsCustomOrder] = useState<boolean>(false);

  // Copy categories array
  useEffect(() => {
    setLocalCategories([...props.categories]);
  }, [props.categories]);
  
  // Copy apps array
  useEffect(() => {
    setLocalApps([...props.apps]);
  }, [props.apps]);

  // Check ordering
  useEffect(() => {
    const order = searchConfig("useOrdering", "");

    if (order === "orderId") {
      setIsCustomOrder(true);
    }
  }, []);

  const deleteCategoryHandler = (category: Category): void => {
    const proceed = window.confirm(
      `Are you sure you want to delete ${category.name}? It will delete ALL assigned apps`
    );

    if (proceed) {
      props.deleteAppCategory(category.id);
    }
  };

  const deleteAppHandler = (app: App): void => {
    const proceed = window.confirm(
      `Are you sure you want to delete ${app.name} at ${app.url} ?`
    );

    if (proceed) {
      props.deleteApp(app.id);
    }
  };

  // Support keyboard navigation for actions
  const keyboardActionHandler = (
    e: KeyboardEvent,
    object: any,
    handler: Function
  ) => {
    if (e.key === "Enter") {
      handler(object);
    }
  };

  const dragEndHandler = (result: DropResult): void => {
    if (!isCustomOrder) {
      props.createNotification({
        title: "Error",
        message: "Custom order is disabled",
      });
      return;
    }

    if (!result.destination) {
      return;
    }

    if (props.contentType === ContentType.app) {
      const tmpApps = [...localApps];
      const [movedApp] = tmpApps.splice(result.source.index, 1);
      tmpApps.splice(result.destination.index, 0, movedApp);

      setLocalApps(tmpApps);
      props.reorderApps(tmpApps);
    } else if (props.contentType === ContentType.category) {
      const tmpCategories = [...localCategories];
      const [movedCategory] = tmpCategories.splice(result.source.index, 1);
      tmpCategories.splice(result.destination.index, 0, movedCategory);

      setLocalCategories(tmpCategories);
      props.reorderAppCategories(tmpCategories);
    }
  };
  
  if (props.contentType === ContentType.category) {
    return (
      <Fragment>
        <div className={classes.Message}>
          {isCustomOrder ? (
            <p>You can drag and drop single rows to reorder categories</p>
          ) : (
            <p>
              Custom order is disabled. You can change it in{" "}
              <Link to="/settings/other">settings</Link>
            </p>
          )}
        </div>
        <DragDropContext onDragEnd={dragEndHandler}>
          <Droppable droppableId="categories">
            {(provided) => (
              <Table headers={["Name", "Actions"]} innerRef={provided.innerRef}>
                {localCategories.map(
                  (category: Category, index): JSX.Element => {
                    return (
                      <Draggable
                        key={category.id}
                        draggableId={category.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => {
                          const style = {
                            border: snapshot.isDragging
                              ? "1px solid var(--color-accent)"
                              : "none",
                            borderRadius: "4px",
                            ...provided.draggableProps.style,
                          };

                          return (
                            <tr
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              style={style}
                            >
                              <td>{category.name}</td>
                              {!snapshot.isDragging && (
                                <td className={classes.TableActions}>
                                  <div
                                    className={classes.TableAction}
                                    onClick={() =>
                                      deleteCategoryHandler(category)
                                    }
                                    onKeyDown={(e) =>
                                      keyboardActionHandler(
                                        e,
                                        category,
                                        deleteCategoryHandler
                                      )
                                    }
                                    tabIndex={0}
                                  >
                                    <Icon icon="mdiDelete" />
                                  </div>
                                  <div
                                    className={classes.TableAction}
                                    onClick={() =>
                                      props.updateHandler(category)
                                    }
                                    tabIndex={0}
                                  >
                                    <Icon icon="mdiPencil" />
                                  </div>
                                  <div
                                    className={classes.TableAction}
                                    onClick={() => props.pinAppCategory(category)}
                                    onKeyDown={(e) =>
                                      keyboardActionHandler(
                                        e,
                                        category,
                                        props.pinAppCategory
                                      )
                                    }
                                    tabIndex={0}
                                  >
                                    {category.isPinned ? (
                                      <Icon
                                        icon="mdiPinOff"
                                        color="var(--color-accent)"
                                      />
                                    ) : (
                                      <Icon icon="mdiPin" />
                                    )}
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        }}
                      </Draggable>
                    );
                  }
                )}
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <div className={classes.Message}>
          {isCustomOrder ? (
            <p>You can drag and drop single rows to reorder application</p>
          ) : (
            <p>
              Custom order is disabled. You can change it in{" "}
              <Link to="/settings/other">settings</Link>
            </p>
          )}
        </div>
        <DragDropContext onDragEnd={dragEndHandler}>
          <Droppable droppableId="apps">
            {(provided) => (
              <Table
                headers={["Name", "URL", "Icon", "Category", "Actions"]}
                innerRef={provided.innerRef}
              >
                {localApps.map((app: App, index): JSX.Element => {
                  return (
                    <Draggable
                      key={app.id}
                      draggableId={app.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => {
                        const style = {
                          border: snapshot.isDragging
                            ? "1px solid var(--color-accent)"
                            : "none",
                          borderRadius: "4px",
                          ...provided.draggableProps.style,
                        };

                        const category = localCategories.find((category: Category) => category.id === app.categoryId);
                        const categoryName = category?.name;

                        return (
                          <tr
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            style={style}
                          >
                            <td style={{ width: "200px" }}>{app.name}</td>
                            <td style={{ width: "200px" }}>{app.url}</td>
                            <td style={{ width: "200px" }}>{app.icon}</td>
                            <td style={{ width: "200px" }}>{categoryName}</td>
                            {!snapshot.isDragging && (
                              <td className={classes.TableActions}>
                                <div
                                  className={classes.TableAction}
                                  onClick={() => deleteAppHandler(app)}
                                  onKeyDown={(e) =>
                                    keyboardActionHandler(
                                      e,
                                      app,
                                      deleteAppHandler
                                    )
                                  }
                                  tabIndex={0}
                                >
                                  <Icon icon="mdiDelete" />
                                </div>
                                <div
                                  className={classes.TableAction}
                                  onClick={() => props.updateHandler(app)}
                                  onKeyDown={(e) =>
                                    keyboardActionHandler(
                                      e,
                                      app,
                                      props.updateHandler
                                    )
                                  }
                                  tabIndex={0}
                                >
                                  <Icon icon="mdiPencil" />
                                </div>
                                <div
                                  className={classes.TableAction}
                                  onClick={() => props.pinApp(app)}
                                  onKeyDown={(e) =>
                                    keyboardActionHandler(e, app, props.pinApp)
                                  }
                                  tabIndex={0}
                                >
                                  {app.isPinned ? (
                                    <Icon
                                      icon="mdiPinOff"
                                      color="var(--color-accent)"
                                    />
                                  ) : (
                                    <Icon icon="mdiPin" />
                                  )}
                                </div>
                              </td>
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
      </Fragment>
    );
  }
};

const actions = {
  pinAppCategory,
  deleteAppCategory,
  reorderAppCategories,
  pinApp,
  deleteApp,
  reorderApps,
  updateConfig,
  createNotification,
};

export default connect(null, actions)(AppTable);
