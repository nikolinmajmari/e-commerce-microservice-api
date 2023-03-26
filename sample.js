/// updated version

    //// clean input for automotive industry
    $("#start-again-button").click(function () {
      $(".f-steps-wrap._1 .w--redirected-checked").removeClass(
        "w--redirected-checked"
      );
      $("form [name='automotive-industry']").prop("checked", false);
      disableBtn();
    });
  
    /// clean input for velachies interested
    $("#start").click(function () {
      $(".f-steps-wrap._2 .w--redirected-checked").removeClass(
        "w--redirected-checked"
      );
      $("form [name='vehicle-type']").prop("checked", false);
      disableBtn();
    });
  
    /// fixes in form step of countrie select
  
    (function () {
      /// allow only one to select
      const selects = [
        "field-gcc",
        "field-na",
        "field-africa",
        "field-asia",
        "field-mea",
        "field-other"
      ];
      $("._4 select").change(function () {
        const id = $(this).attr("id");
        const value = $(this).val();
        console.log("change", id, value);
        if (value != null && value != "") {
          for (const select of selects) {
            console.log("checking", select, id);
            if (select != id) {
              unselectById(select);
            }
          }
          enableBtn();
          $("._4 #hidden-location").val(value);
        } else {
          disableBtn();
          $("._4 #hidden-location").val(value);
        }
      });
  
      function unselectById(id) {
        console.log("unselect", id);
        const select = document.querySelector("#" + id);
        select.tomselect.setValue("Select Country");
      }
  
      function removeOptions(id, options) {
        const node = document.getElementById(id);
        const control = node.tomselect;
        for (const option of options) {
          control.removeOption(option);
        }
      }
  
      /**
       *
       * @param {*} id
       * @param {array} keep
       */
      function removeOtherOptions(id, keep) {
        const node = document.getElementById(id);
        const control = node.tomselect;
        const options = control.options;
        for (const option in options) {
          if (!keep.includes(option)) {
            control.removeOption(option);
          }
        }
      }
  
      const gcc = [
        "Bahrain",
        "KSA",
        "Kuwait",
        "Oman",
        "Qatar",
        "United Arab Emirates"
      ];
      const northAmerica = ["Canada", "United States of America"];
      const africa = [
        "Cameroon",
        "Congo",
        "DR Congo",
        "Egypt",
        "Ghana",
        "Mali",
        "Nigeria",
        "Sudan",
        "Kenya"
      ];
      const asia = [
        "Azerbaijan",
        "China",
        "Kazakhstan",
        "Kurdistan",
        "Pakistan",
        "Singapore"
      ];
      const middleEast = ["Iraq", "Jordan", "Lebanon", "Libya", "Yemen"];
      const used = gcc
        .concat(northAmerica)
        .concat(africa)
        .concat(asia)
        .concat(middleEast)
        .concat(["Israel"])
        ;
  
      /// gcc
      removeOtherOptions("field-gcc", gcc);
      /// america
      removeOtherOptions("field-na", northAmerica);
      /// america
      removeOtherOptions("field-africa", africa);
      // asia
      removeOtherOptions("field-asia", asia);
      /// middle east
      removeOtherOptions("field-mea", middleEast);
      /// cleam used
      removeOptions("field-other", used);
    })();
  
    //// step 3 hidden input configuration
    (function () {
      var values = [];
      var textValue = "";
  
      $("#other-vehicle-brand").change(function () {
        const target = $("._3 #hidden-brand");
        textValue = $(this).val();
        updateHiddenInput();
      });
      $("._3 input[type='checkbox']").change(function () {
        const target = $("._3 #hidden-brand");
        const other = $("#other-vehicle-brand");
        if ($(this).is(":checked")) {
          values.push($(this).attr("name"));
        } else {
          values = values.filter((e) => e != $(this).attr("name"));
        }
        updateHiddenInput();
      });
      function updateHiddenInput() {
        const target = $("._3 #hidden-brand");
        if (values.length == 0 && textValue == "") {
          disableBtn();
          target.val(undefined);
        } else if (values.length != 0 && textValue == "") {
          target.val(values.join(", "));
          enableBtn();
        } else if (values.length == 0 && textValue != "") {
          target.val(textValue);
          enableBtn();
        } else {
          target.val(values.concat([textValue]).join(", "));
        }
      }
    })();