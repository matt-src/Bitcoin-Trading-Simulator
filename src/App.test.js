import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux'
import store from "./store/index";
import userEvent from '@testing-library/user-event'
import { updatePrice, executeTrade } from "./actions/index";
require('chromedriver');
const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

test('setting amount input changes amount traded', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>);
  userEvent.type(screen.getByRole('spinbutton'), '100')
  userEvent.click(screen.getByText('Buy'))
  expect(store.getState().shares).toEqual(100);
});

test('dispatching a price update action updates price', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>);
  store.dispatch(updatePrice(500));
  expect(store.getState().price).toEqual(500);
});

test('selling shares updates realized PNL', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>);
  store.dispatch(executeTrade(-10));
  expect(store.getState().realized).toEqual(5000);
});

test('validate title on the home page', async () => {
  await driver.get('localhost:3000')
  const title = await driver.findElement(By.tagName('h1')).getText()
  expect(title).toContain('Trading Simulator')
})