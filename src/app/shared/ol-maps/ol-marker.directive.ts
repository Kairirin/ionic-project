import { afterNextRender, afterRenderEffect, Directive, inject, input } from "@angular/core";
import { OlMapDirective } from "./ol-map.directive";
import { Feature } from "ol";
import { Point } from "ol/geom";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import CircleStyle from 'ol/style/Circle';

@Directive({
  selector: 'ol-marker',
})
export class OlMarkerDirective {
  #olMap = inject(OlMapDirective);
  coordinates = input.required<[number, number]>();
  color = input('red');
  fill = input('white');
  #marker!: Feature;

  constructor() {
    afterNextRender(() => {
      this.#marker = new Feature({
        geometry: new Point(this.coordinates()),
      });
      this.#marker.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 9,
            fill: new Fill({
              color: this.color(),
            }),
            stroke: new Stroke({
              color: this.fill(),
              width: 3,
            }),
          }),
        })
      );

      this.#olMap.vectorLayer.getSource()?.addFeature(this.#marker);
    });

    afterRenderEffect(() => { 
      this.#marker.setGeometry(new Point(this.coordinates()))
    });
  }
}
