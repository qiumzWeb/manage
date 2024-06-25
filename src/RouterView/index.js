import React, { lazy, Suspense } from 'react';
import { Loading } from '@/component'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { AliveScope } from 'react-activation'
import { flatMap, isObj } from 'assets/js'
import routes from './routes';
import Layout from '@/layout'
import Bus from 'assets/js/bus'


export default function RouteView() {
  return (
    <Router>
      <AliveScope>
      <Layout>
        <Suspense fallback={loadRoute()}>
          <Switch>
              {RenderRoute(routes)}
          </Switch>
        </Suspense>
      </Layout>
      </AliveScope>
    </Router>
  );
}
function loadRoute() {
  return <div style={{
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Loading></Loading>
  </div>
}

function RenderRoute(routes) {
    const newRoutes = flatMap(routes);
    newRoutes.forEach(n => {
      n.component = lazy(n.component);
    });
    Bus.setState({
      routes: newRoutes
    })
    return (
      Array.isArray(newRoutes) &&
      newRoutes.map((r, key) => {
        if (!isObj(r)) return null;
        return <Route {...r} key={key}></Route>;
      })
    );
}
