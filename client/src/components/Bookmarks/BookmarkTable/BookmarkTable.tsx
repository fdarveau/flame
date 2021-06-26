import { Fragment, KeyboardEvent, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Bookmark, Category, NewNotification } from '../../../interfaces';
import {
  createNotification,
  deleteBookmark,
  deleteBookmarkCategory,
  pinBookmark,
  pinBookmarkCategory,
  reorderBookmarkCategories,
  reorderBookmarks,
  updateConfig,
} from '../../../store/actions';
import { searchConfig } from '../../../utility';
import Icon from '../../UI/Icons/Icon/Icon';
import Table from '../../UI/Table/Table';
import { ContentType } from '../Bookmarks';
import classes from './BookmarkTable.module.css';

interface ComponentProps {
  contentType: ContentType;
  categories: Category[];
  bookmarks: Bookmark[];
  pinBookmarkCategory: (category: Category) => void;
  deleteBookmarkCategory: (id: number) => void;
  reorderBookmarkCategories: (categories: Category[]) => void;
  updateHandler: (data: Category | Bookmark) => void;
  pinBookmark: (bookmark: Bookmark) => void;
  deleteBookmark: (id: number, categoryId: number) => void;
  reorderBookmarks: (bookmarks: Bookmark[]) => void;
  updateConfig: (formData: any) => void;
  createNotification: (notification: NewNotification) => void;
}

const BookmarkTable = (props: ComponentProps): JSX.Element => {
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [localBookmarks, setLocalBookmarks] = useState<Bookmark[]>([]);
  const [isCustomOrder, setIsCustomOrder] = useState<boolean>(false);

  // Copy categories array
  useEffect(() => {
    setLocalCategories([...props.categories]);
  }, [props.categories]);

  // Copy bookmarks array
  useEffect(() => {
    setLocalBookmarks([...props.bookmarks]);
  }, [props.bookmarks]);

  // Check ordering
  useEffect(() => {
    const order = searchConfig("useOrdering", "");

    if (order === "orderId") {
      setIsCustomOrder(true);
    }
  }, []);

  const deleteCategoryHandler = (category: Category): void => {
    const proceed = window.confirm(
      `Are you sure you want to delete ${category.name}? It will delete ALL assigned bookmarks`
    );

    if (proceed) {
      props.deleteBookmarkCategory(category.id);
    }
  };

  const deleteBookmarkHandler = (bookmark: Bookmark): void => {
    const proceed = window.confirm(
      `Are you sure you want to delete ${bookmark.name}?`
    );

    if (proceed) {
      props.deleteBookmark(bookmark.id, bookmark.categoryId);
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

    if (props.contentType === ContentType.bookmark) {
      const tmpBookmarks = [...localBookmarks];
      const [movedBookmark] = tmpBookmarks.splice(result.source.index, 1);
      tmpBookmarks.splice(result.destination.index, 0, movedBookmark);

      setLocalBookmarks(tmpBookmarks);
      props.reorderBookmarks(tmpBookmarks);
    } else if (props.contentType === ContentType.category) {
      const tmpCategories = [...localCategories];
      const [movedCategory] = tmpCategories.splice(result.source.index, 1);
      tmpCategories.splice(result.destination.index, 0, movedCategory);

      setLocalCategories(tmpCategories);
      props.reorderBookmarkCategories(tmpCategories);
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
                                    onClick={() =>
                                      props.pinBookmarkCategory(category)
                                    }
                                    onKeyDown={(e) =>
                                      keyboardActionHandler(
                                        e,
                                        category,
                                        props.pinBookmarkCategory
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
            <p>You can drag and drop single rows to reorder bookmarklication</p>
          ) : (
            <p>
              Custom order is disabled. You can change it in{" "}
              <Link to="/settings/other">settings</Link>
            </p>
          )}
        </div>
        <DragDropContext onDragEnd={dragEndHandler}>
          <Droppable droppableId="bookmarks">
            {(provided) => (
              <Table
                headers={["Name", "URL", "Icon", "Category", "Actions"]}
                innerRef={provided.innerRef}
              >
                {localBookmarks.map(
                  (bookmark: Bookmark, index): JSX.Element => {
                    return (
                      <Draggable
                        key={bookmark.id}
                        draggableId={bookmark.id.toString()}
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

                          const category = localCategories.find(
                            (category: Category) =>
                              category.id === bookmark.categoryId
                          );
                          const categoryName = category?.name;

                          return (
                            <tr
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              style={style}
                            >
                              <td style={{ width: "200px" }}>
                                {bookmark.name}
                              </td>
                              <td style={{ width: "200px" }}>{bookmark.url}</td>
                              <td style={{ width: "200px" }}>
                                {bookmark.icon}
                              </td>
                              <td style={{ width: "200px" }}>{categoryName}</td>
                              {!snapshot.isDragging && (
                                <td className={classes.TableActions}>
                                  <div
                                    className={classes.TableAction}
                                    onClick={() =>
                                      deleteBookmarkHandler(bookmark)
                                    }
                                    onKeyDown={(e) =>
                                      keyboardActionHandler(
                                        e,
                                        bookmark,
                                        deleteBookmarkHandler
                                      )
                                    }
                                    tabIndex={0}
                                  >
                                    <Icon icon="mdiDelete" />
                                  </div>
                                  <div
                                    className={classes.TableAction}
                                    onClick={() =>
                                      props.updateHandler(bookmark)
                                    }
                                    onKeyDown={(e) =>
                                      keyboardActionHandler(
                                        e,
                                        bookmark,
                                        props.updateHandler
                                      )
                                    }
                                    tabIndex={0}
                                  >
                                    <Icon icon="mdiPencil" />
                                  </div>
                                  <div
                                    className={classes.TableAction}
                                    onClick={() => props.pinBookmark(bookmark)}
                                    onKeyDown={(e) =>
                                      keyboardActionHandler(
                                        e,
                                        bookmark,
                                        props.pinBookmark
                                      )
                                    }
                                    tabIndex={0}
                                  >
                                    {bookmark.isPinned ? (
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
  }
};

const actions = {
  pinBookmarkCategory,
  deleteBookmarkCategory,
  reorderBookmarkCategories,
  pinBookmark,
  deleteBookmark,
  reorderBookmarks,
  updateConfig,
  createNotification,
};

export default connect(null, actions)(BookmarkTable);
