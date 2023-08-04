import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { GeneralForm, Query } from '../../../interfaces';
import { actionCreators } from '../../../store';
import { State } from '../../../store/reducers';
import { generalSettingsTemplate, inputHandler } from '../../../utility';
import searchQueries from '../../../utility/searchQueries.json';
import { Button, InputGroup, SettingsHeadline } from '../../UI';
import { CustomQueries } from './CustomQueries/CustomQueries';

export const GeneralSettings = (): JSX.Element => {
  const config = useSelector((state: State) => state.config);
  const appCategories = useSelector((state: State) => state.apps.categories);
  const bookmarkCategories = useSelector((state: State) => state.bookmarks.categories);

  const dispatch = useDispatch();
  const { updateConfig, sortApps, sortCategories, sortBookmarks } =
    bindActionCreators(actionCreators, dispatch);

  const queries = searchQueries.queries;

  // Initial state
  const [formData, setFormData] = useState<GeneralForm>(
    generalSettingsTemplate
  );

  // Get config
  useEffect(() => {
    setFormData({
      ...config.config,
    });
  }, [config]);

  // Form handler
  const formSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();

    // Save settings
    await updateConfig(formData);

    // Sort entities with new settings
    if (formData.useOrdering !== config.config.useOrdering) {
      sortCategories();

      for (let { id } of appCategories) {
        sortApps(id);
      }

      for (let { id } of bookmarkCategories) {
        sortBookmarks(id);
      }
    }
  };

  // Input handler
  const inputChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    options?: { isNumber?: boolean; isBool?: boolean }
  ) => {
    inputHandler<GeneralForm>({
      e,
      options,
      setStateHandler: setFormData,
      state: formData,
    });
  };

  return (
    <Fragment>
      <form
        onSubmit={(e) => formSubmitHandler(e)}
        style={{ marginBottom: '30px' }}
      >
        {/* === GENERAL OPTIONS === */}
        <SettingsHeadline text="General" />
        {/* SORT TYPE */}
        <InputGroup>
          <label htmlFor="useOrdering">Sorting type</label>
          <select
            id="useOrdering"
            name="useOrdering"
            value={formData.useOrdering}
            onChange={(e) => inputChangeHandler(e)}
          >
            <option value="createdAt">By creation date</option>
            <option value="name">Alphabetical order</option>
            <option value="orderId">Custom order</option>
          </select>
        </InputGroup>

        {/* === APPS OPTIONS === */}
        <SettingsHeadline text="Apps" />
        {/* PIN APPS */}
        <InputGroup>
          <label htmlFor="pinAppsByDefault">
            Pin new applications by default
          </label>
          <select
            id="pinAppsByDefault"
            name="pinAppsByDefault"
            value={formData.pinAppsByDefault ? 1 : 0}
            onChange={(e) => inputChangeHandler(e, { isBool: true })}
          >
            <option value={1}>True</option>
            <option value={0}>False</option>
          </select>
        </InputGroup>

        {/* APPS OPPENING */}
        <InputGroup>
          <label htmlFor="appsSameTab">Open applications in the same tab</label>
          <select
            id="appsSameTab"
            name="appsSameTab"
            value={formData.appsSameTab ? 1 : 0}
            onChange={(e) => inputChangeHandler(e, { isBool: true })}
          >
            <option value={1}>True</option>
            <option value={0}>False</option>
          </select>
        </InputGroup>

        {/* === BOOKMARKS OPTIONS === */}
        <SettingsHeadline text="Bookmarks" />
        {/* PIN CATEGORIES */}
        <InputGroup>
          <label htmlFor="pinCategoriesByDefault">
            Pin new categories by default
          </label>
          <select
            id="pinCategoriesByDefault"
            name="pinCategoriesByDefault"
            value={formData.pinCategoriesByDefault ? 1 : 0}
            onChange={(e) => inputChangeHandler(e, { isBool: true })}
          >
            <option value={1}>True</option>
            <option value={0}>False</option>
          </select>
        </InputGroup>

        {/* BOOKMARKS OPPENING */}
        <InputGroup>
          <label htmlFor="bookmarksSameTab">
            Open bookmarks in the same tab
          </label>
          <select
            id="bookmarksSameTab"
            name="bookmarksSameTab"
            value={formData.bookmarksSameTab ? 1 : 0}
            onChange={(e) => inputChangeHandler(e, { isBool: true })}
          >
            <option value={1}>True</option>
            <option value={0}>False</option>
          </select>
        </InputGroup>

        {/* === SEARCH OPTIONS === */}
        <SettingsHeadline text="Search" />
        <InputGroup>
          <label htmlFor="defaultSearchProvider">Primary search provider</label>
          <select
            id="defaultSearchProvider"
            name="defaultSearchProvider"
            value={formData.defaultSearchProvider}
            onChange={(e) => inputChangeHandler(e)}
          >
            {[...searchQueries.queries, ...config.customQueries].map((query: Query, idx) => {
              const isCustom = idx >= searchQueries.queries.length;

              return (
                <option key={idx} value={query.prefix}>
                  {isCustom && '+'} {query.name}
                </option>
              );
            })}
          </select>
        </InputGroup>

        {formData.defaultSearchProvider === 'l' && (
          <InputGroup>
            <label htmlFor="secondarySearchProvider">
              Secondary search provider
            </label>
            <select
              id="secondarySearchProvider"
              name="secondarySearchProvider"
              value={formData.secondarySearchProvider}
              onChange={(e) => inputChangeHandler(e)}
            >
              {[...searchQueries.queries, ...config.customQueries].map((query: Query, idx) => {
                const isCustom = idx >= searchQueries.queries.length;

                return (
                  <option key={idx} value={query.prefix}>
                    {isCustom && '+'} {query.name}
                  </option>
                );
              })}
            </select>
            <span>
              Will be used when "Local search" is primary search provider and
              there are not any local results
            </span>
          </InputGroup>
        )}

        <InputGroup>
          <label htmlFor="searchSameTab">
            Open search results in the same tab
          </label>
          <select
            id="searchSameTab"
            name="searchSameTab"
            value={formData.searchSameTab ? 1 : 0}
            onChange={(e) => inputChangeHandler(e, { isBool: true })}
          >
            <option value={1}>True</option>
            <option value={0}>False</option>
          </select>
        </InputGroup>

        <Button>Save changes</Button>
      </form>

      {/* CUSTOM QUERIES */}
      <SettingsHeadline text="Custom search providers" />
      <CustomQueries />
    </Fragment>
  );
};
