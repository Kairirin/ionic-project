import { Directive, inject, ElementRef, output, afterNextRender } from "@angular/core";
import { SearchResult } from "./search-result";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";

@Directive({
  selector: 'ga-autocomplete',
  host: {
    'style': `
      z-index: 1;
      display: block;
      position: absolute;
      top: 20px;
      right: 20px;
      width: 50%;
      background-color: white;
    `
  }
})
export class GaAutocompleteDirective {
  #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  #autoComplete!: GeocoderAutocomplete;
  locationChange = output<SearchResult>();

  constructor() {
    afterNextRender(() => {
      this.#autoComplete = new GeocoderAutocomplete(
        this.#elementRef.nativeElement,
        "80450f5be6524b719838e90b27389971",
        { lang: "es" , debounceDelay: 600}
      );

      this.#autoComplete.on("select", (location) => {
        this.locationChange.emit({
          coordinates: location.geometry.coordinates,
          address: location.properties.formatted
        });
      });
    });
  }

}